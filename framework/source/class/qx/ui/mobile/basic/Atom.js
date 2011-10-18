/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Gabriel Munteanu (gabios)

************************************************************************ */

/**
 * EXPERIMENTAL - NOT READY FOR PRODUCTION
 *
 * A multi-purpose widget, which combines a label with an icon.
 *
 * The intended purpose of qx.ui.basic.Atom is to easily align the common icon-text
 * combination in different ways.
 *
 *
 */
qx.Class.define("qx.ui.mobile.basic.Atom",
{
  extend : qx.ui.mobile.core.Widget,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param label {String} Label to use
   * @param icon {String?null} Icon to use
   */
  construct : function(label, icon)
  {
    this.base(arguments);
    this.__createChildren(label, icon);
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "atom"
    },

    /** The label/caption/text of the qx.ui.mobile.basic.Atom instance */
    label :
    {
      apply : "_applyLabel",
      nullable : true,
      check : "String"
    },

    /** Any URI String supported by qx.ui.mobile.basic.Image to display an icon */
    icon :
    {
      check : "String",
      apply : "_applyIcon",
      nullable : true
    },


    /**
     * The space between the icon and the label
     */
    gap :
    {
      check : "Integer",
      nullable : false,
      apply : "_applyGap",
      init : 4
    },


    /**
     * Configure the visibility of the sub elements/widgets.
     * Possible values: both, text, icon
     */
    show :
    {
      init : "both",
      check : [ "both", "label", "icon" ],
      inheritable : true,
      apply : "_applyShow"
    },


    /**
     * The position of the icon in relation to the text.
     * Only useful/needed if text and icon is configured and 'show' is configured as 'both' (default)
     */
    iconPosition :
    {
      init   : "left",
      check : [ "top", "right", "bottom", "left" ],
      apply : "_applyIconPosition"
    },


    /**
     * Whether the content should be rendered centrally when to much space
     * is available. Affects both axis.
     */
    center :
    {
      init : false,
      check : "Boolean",
      apply : "_applyCenter"
    }
  },
  
  members :
  {
  
    __label : null,
    __icon : null,
    __childrenContainer : null,
    __emptyLabel : null,

    _applyIconPosition : function(value, old)
    {
      var newLayout;
      var verticalLayout = [ "top", "bottom" ].indexOf(value) != -1;
      var oldVerticalLayout = [ "top", "bottom" ].indexOf(old) != -1;
      if(verticalLayout && !oldVerticalLayout) {
        newLayout = new qx.ui.mobile.layout.VBox();
      }
      if(!verticalLayout && oldVerticalLayout) {
        newLayout = new qx.ui.mobile.layout.HBox();
      }
      if(newLayout) {
        this.__childrenContainer.setLayout(newLayout);
      }
      var iconFirst = [ "top", "left" ].indexOf(value) != -1;
      var oldIconFirst = [ "top", "left" ].indexOf(old) != -1;
      if(iconFirst != oldIconFirst)
      {
        if(iconFirst) {
          this.__childrenContainer.remove(this.__label);
          this.__childrenContainer._addAfter(this.__label, this.__icon);
        }
        else {
          this.__childrenContainer.remove(this.__icon);
          this.__childrenContainer._addAfter(this.__icon, this.__label);
        }
        this._domUpdated();
      }
    },
    
    _applyShow : function(value, old)
    {
      if(value === 'both')
      {
        if(this.__label) {
          this.__label.show();
        }
        if(this.__icon) {
          this.__icon.show();
        }
      }
      if(value === 'icon')
      {
        if(this.__label) {
          this.__label.exclude();
        }
        if(this.__icon) {
          this.__icon.show();
        }
      }
      if(value === 'label')
      {
        if(this.__icon) {
          this.__icon.exclude();
        }
        if(this.__label) {
          this.__label.show();
        }
      }
    },
    
    _applyLabel : function(value, old)
    {
      if(this.__label)
      {
        this.__label.setValue(value);
      }
      else
      {
        this.__label = new qx.ui.mobile.basic.Label(value);
        this.__label.setAnonymous(true);
        this.__label.setWrap(false);
        var iconFirst = [ "top", "left" ].indexOf(this.getIconPosition()) != -1;
        if(iconFirst) {
          this.__childrenContainer._addAfter(this.__label, this.__icon);
        } else {
          this.__childrenContainer._addBefore(this.__label, this.__icon);
        }
      }
    },
    
    _applyIcon : function(value, old)
    {
      if(this.__icon)
      {
        this.__icon.setSource(value);
      }
      else
      {
        this.__icon = new qx.ui.mobile.basic.Image(value);
        this.__icon.setAnonymous(true);
        var iconFirst = [ "top", "left" ].indexOf(this.getIconPosition()) != -1;
        if(iconFirst) {
          this.__childrenContainer._addBefore(this.__icon, this.__label);
        } else {
          this.__childrenContainer._addAfter(this.__icon, this.__label);
        }
      }
    },
    
    getIconWidget: function() {
      return this.__icon;
    },
    
    getLabelWidget : function() {
      return this.__label;
    },

    /**
     *
     * This function is responsible for creating and adding 2 children controls to the Button widget.
     * A label and an icon.
     * @param label {String} the text of the button
     * @param icon {String} A path to an image resource
     *
     */
    __createChildren : function(label, icon) {
      if(label)
      {
        this.__label = new qx.ui.mobile.basic.Label(label);
        this.__label.setAnonymous(true);
        this.__label.setWrap(false);
        this.setLabel(label);
      }
      if(icon)
      {
        this.__icon = new qx.ui.mobile.basic.Image(icon);
        this.__icon.setAnonymous(true);
        this.setIcon(icon);
      }
      var verticalLayout = [ "top", "bottom" ].indexOf(this.getIconPosition()) != -1;
      var layout = verticalLayout ? new qx.ui.mobile.layout.VBox() : new qx.ui.mobile.layout.HBox();
      if(this.getCenter())
      {
        if(verticalLayout)
        {
          layout.set({alignY: "middle"});
        }
        else
        {
          layout.set({alignX: "center"});
        }
      }
      this.__childrenContainer = new qx.ui.mobile.container.Composite(layout);
      this.__childrenContainer.setAnonymous(true);
      var iconFirst = [ "top", "left" ].indexOf(this.getIconPosition()) != -1;
      if(this.__icon && this.__label)
      {
        this.__childrenContainer.add(iconFirst ? this.__icon : this.__label);
        this.__childrenContainer.add(!iconFirst ? this.__icon : this.__label);
      }
      else
      {
        if(this.__icon) {
          this.__childrenContainer.add(this.__icon);
        }
        if(this.__label) {
          this.__childrenContainer.add(this.__label);
        }
        else
        {
          if(!this.__icon)
          {
            this.__emptyLabel = new qx.ui.mobile.basic.Label(" ");
            this.__childrenContainer.add(this.__emptyLabel);
          }
        }
      }
      if(this.getShow() === 'icon' && this.__label) {
        this.__label.exclude();
      }
      if(this.getShow() === 'label' && this.__icon) {
        this.__icon.exclude();
      }
      this._add(this.__childrenContainer);
    }
  }
});
