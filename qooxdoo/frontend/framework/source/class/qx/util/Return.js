/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2006 by 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL 2.1: http://www.gnu.org/licenses/lgpl.html

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/* ************************************************************************

#module(core)

************************************************************************ */

qx.OO.defineClass("qx.util.Return");





/*
---------------------------------------------------------------------------
  SIMPLE RETURN METHODS
---------------------------------------------------------------------------
*/

qx.util.Return.returnTrue = function() {
  return true;
}

qx.util.Return.returnFalse = function() {
  return false;
}

qx.util.Return.returnNull = function() {
  return null;
}

qx.util.Return.returnThis = function() {
  return this;
}

qx.util.Return.returnZero = function() {
  return 0;
}

qx.util.Return.returnNegativeIndex = function() {
  return -1;
}
