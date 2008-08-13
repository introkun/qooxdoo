/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/**
 * This is a simple image class using the low level image features of
 * qooxdoo and wraps it for the qx.html layer.
 */
qx.Class.define("qx.html.Image",
{
  extend : qx.html.Element,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      ELEMENT API
    ---------------------------------------------------------------------------
    */

    // overridden
    _applyProperty : function(name, value)
    {
      this.base(arguments, name, value);

      if (name === "source" || name === "scale")
      {
        var dom = this._element;

        if (dom)
        {
          var source = this._getProperty("source");
          var repeat = this._getProperty("scale") || "no-repeat";

          qx.bom.element.Decoration.update(dom, source, repeat);
        }
      }
    },


    // overridden
    _createDomElement : function()
    {
      var source = this._getProperty("source");
      var repeat = this._getProperty("scale") || "no-repeat";

      var html = qx.bom.element.Decoration.create(source, repeat);
      var el = document.createElement("div");
      el.innerHTML = html;
      return el.firstChild;
    },


    // overridden
    // be sure that style attributes are merged and not overwritten
    _copyData : function(fromMarkup) {
      return this.base(arguments, true);
    },





    /*
    ---------------------------------------------------------------------------
      IMAGE API
    ---------------------------------------------------------------------------
    */

    /**
     * Configures the image source (a full qualified URL)
     *
     * @param value {Boolean} Whether the HTML mode should be used.
     * @return {qx.html.Label} This instance for for chaining support.
     */
    setSource : function(value)
    {
      this._setProperty("source", value);
      return this;
    },


    /**
     * Returns the image source.
     *
     * @return {String} Current image source.
     */
    getSource : function() {
      return this._getProperty("source");
    },



    resetSource : function() {
      this._removeProperty("source");
      return this;
    },


    /**
     * Whether the image should be scaled or not.
     *
     * @param value {Boolean} Scale the image
     * @return {qx.html.Label} This instance for for chaining support.
     */
    setScale : function(value)
    {
      this._setProperty("scale", value);
      return this;
    },


    /**
     * Returns whether the image is scaled or not.
     *
     * @return {Boolean} Whether the image is scaled
     */
    getScale : function() {
      return this._getProperty("scale");
    }
  }
});
