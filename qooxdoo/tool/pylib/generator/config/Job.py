#!/usr/bin/env python

################################################################################
#
#  qooxdoo - the new era of web development
#
#  http://qooxdoo.org
#
#  Copyright:
#    2006-2008 1&1 Internet AG, Germany, http://www.1und1.de
#
#  License:
#    LGPL: http://www.gnu.org/licenses/lgpl.html
#    EPL: http://www.eclipse.org/org/documents/epl-v10.php
#    See the LICENSE file in the project's top-level directory for details.
#
#  Authors:
#    * Thomas Herchenroeder (thron7)
#
################################################################################

import os, sys, re, types, string, copy
import simplejson

#from generator.config.Config import ExtMap

console = None

class Job(object):

    # keys of the job data map
    EXTEND_KEY   = "extend"
    RUN_KEY      = "run"
    LET_KEY      = "let"
    RESOLVED_KEY = "resolved"
    KEYS_WITH_JOB_REFS = [RUN_KEY, EXTEND_KEY]

    def __init__(self, name, data, console_, config=None):
        global console
        self.name    = name
        self._console= console_
        self._data   = data
        self._config = config

        console      = console_


    def mergeJob(self, sourceJob):
        sData = sourceJob.getData()
        target= self.getData()

        deepJsonMerge(sData, target)


    def resolveExtend(self, entryTrace=[]):
        # resolve the 'extend' entry of a job
        config = self._config

        if self.hasFeature(self.RESOLVED_KEY):
            return

        self.includeGlobalLet() # make sure potential global let is included first

        if self.hasFeature("extend"):
            # loop through 'extend' entries
            extends = self.getFeature("extend")
            for entry in extends:
                # cyclic check: have we seen this already?
                if entry in entryTrace:
                    raise RuntimeError, "Extend entry already seen: %s" % str(entryTrace+[self.name,entry])
                
                entryJob = config.getJob(entry)  # getJob() handles string/Job polymorphism of 'entry' and returns Job object
                if not entryJob:
                    raise RuntimeError, "No such job: \"%s\" (trace: %s)" % (entry, entryTrace+[self.name])

                # make sure this entry job is fully resolved in its context
                entryJob.resolveExtend(entryTrace + [self.name])

                # now merge the fully expanded job into the current job
                self.mergeJob(entryJob)

        self.setFeature(self.RESOLVED_KEY, True)


    def resolveMacros(self):
        self.includeGlobalLet() # make sure potential global let is included
        if self.hasFeature('let'):
            # exand macros in the let
            letMap = self.getFeature('let')
            letMap = self._expandMacrosInLet(letMap)
            self.setFeature('let', letMap)
            
            # separate strings from other values
            letmaps = {}
            letmaps['str'] = {}
            letmaps['bin'] = {}
            for k in letMap:
                if isinstance(letMap[k], types.StringTypes):
                    letmaps['str'][k] = letMap[k]
                else:
                    letmaps['bin'][k] = letMap[k]
                    
            # apply dict to other values
            self._expandMacrosInValues(self._data, letmaps)


    def includeGlobalLet(self, additionalLet=None):
        #import pydb; pydb.debugger()
        newlet = mapMerge(self.getFeature('let',{}),{}) # init with local let
        if additionalLet:
            newlet = mapMerge(additionalLet, newlet)
        global_let = self._config.get('let',False)
        if global_let:
            newlet = mapMerge(global_let, newlet)

        if newlet:
            self.setFeature('let', newlet) # set cumulative let value


    def _expandString(self, s, mapstr, mapbin):
        assert isinstance(s, types.StringTypes)
        if s.find(r'${') == -1:  # optimization: no macro -> return
            return s
        macro = ""
        sub   = ""
        possiblyBin = re.match(r'^\${(.*)}$', s)   # look for '${...}' as a bin replacement
        if possiblyBin:
            macro = possiblyBin.group(1)
        if macro and (macro in mapbin.keys()):
            sub = mapbin[macro]
        else:
            templ = string.Template(s)
            sub = templ.safe_substitute(mapstr)
        return sub

    def _expandMacrosInValues(self, data, maps):
        """ apply macro expansion on arbitrary values; takes care of recursive data like
            lists and dicts; only actually applies macros when a string is encountered on 
            the way (look for calls to _expandString())"""
        result = data  # intialize result
        
        # arrays
        if isinstance(data, types.ListType):
            for e in range(len(data)):
                enew = self._expandMacrosInValues(data[e], maps)
                if enew != data[e]:
                    console.debug("expanding: %s ==> %s" % (str(data[e]), str(enew)))
                    data[e] = enew
                    
        # dicts
        elif isinstance(data, types.DictType):
            for e in data.keys(): # have to use keys() explicitly since i modify data in place
                # expand in values
                enew = self._expandMacrosInValues(data[e], maps)
                if enew != data[e]:
                    console.debug("expanding: %s ==> %s" % (str(data[e]), str(enew)))
                    data[e] = enew

                # expand in keys
                if ((isinstance(e, types.StringTypes) and
                        e.find(r'${')>-1)):
                    enew = self._expandString(e, maps['str'], {}) # no bin expand here!
                    data[enew] = data[e]
                    del data[e]
                    console.debug("expanding key: %s ==> %s" % (e, enew))

        # strings
        elif isinstance(data, types.StringTypes):
            result = self._expandString(data, maps['str'], maps['bin'])

        # leave everything else alone
        else:
            result = data

        return result


    def _expandMacrosInLet(self, letDict):
        """ do macro expansion within the "let" dict """

        keys = letDict.keys()
        for k in keys:
            kval = letDict[k]
            
            # construct a temp. dict of translation maps, for later calls to _expand* funcs
            # wpbasti: Crazy stuff: Could be find some better variable names here. Seems to be optimized for size already ;)
            if isinstance(kval, types.StringTypes):
                kdicts = {'str': {k:kval}, 'bin': {}}
            else:
                kdicts = {'str': {}, 'bin': {k:kval}}
                
            # cycle through other keys of this dict
            for k1 in keys:
                if k != k1: # no expansion with itself!
                    enew = self._expandMacrosInValues(letDict[k1], kdicts)
                    if enew != letDict[k1]:
                        console.debug("expanding: %s ==> %s" % (k1, str(enew)))
                        letDict[k1] = enew
        return letDict


    def getData(self):
        return self._data

    def getConfig(self):
        return self._config

    def setConfig(self, config):
        self._config = config


    def clone(self):
        return Job(self.name, self._data.copy(), self._console, self._config)

    def hasFeature(self, feature):
        return self._data.has_key(feature)

    def setFeature(self, feature, value):
        self._data[feature]=value

    def getFeature(self, feature, default=None):
        if self._data.has_key(feature):
            return self._data[feature]
        else:
            return default

    def removeFeature(self, feature):
        if feature in self._data:
            del self._data[feature]


# -- utility functions ---------------------------------------------------------

def deepJsonMerge(source, target):
    if not isinstance(source, types.DictType):
        raise TypeError, "Wrong argument to deepJsonMerge (must be Dict)"
    for key in source:
        if key in target:
            # merge arrays rather than shadowing
            if isinstance(source[key], types.ListType):
                # equality problem: in two arbitrary lists, i have no way of telling 
                # whether any pair of elements is somehow related (e.g. specifies the
                # same library), and i can't do recursive search here, with some 
                # similarity reasoning, can i. therefore: non-equal elements are just
                # considered unrelated.
                target[key] = listMerge(source[key],target[key])  # why prepend?!
            
            # merge dicts rather than shadowing
            elif isinstance(source[key], types.DictType):
                # assuming schema-conformance of target[key] as well
                # recurse on the sub-dicts
                deepJsonMerge(source[key], target[key])
                #target[key] = mapMerge(source[key],target[key])
            else:
                pass  # leave target key alone
        else:
            target[key] = source[key]


def mapMerge(source, target):
    """merge source map into target, but don't overwrite existing
       keys in target (unlike target.update(source))"""
    t = source.copy()
    t.update(target)  # target keys take precedence
    return t


def listMerge(source, target):
    """merge source list with target list (currently prepend),
       avoiding duplicates"""
    t = []
    for e in source:
        if not e in target:
            t.append(e)
    return t + target


