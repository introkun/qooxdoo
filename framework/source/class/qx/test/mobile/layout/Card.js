/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

qx.Class.define("qx.test.mobile.layout.Card",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testLayoutInConstructor : function()
    {
      var composite = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.Card());
      this.getRoot().add(composite);

      this._testLayout(composite);

      composite.destroy();
    },

 
    testLayout : function()
    {
      var composite = new qx.ui.mobile.container.Composite();
      composite.setLayout(new qx.ui.mobile.layout.Card());
      this.getRoot().add(composite);

      this._testLayout(composite);

      composite.destroy();
    },


   _testLayout : function(composite) {
      var className = qx.bom.element.Class.get(composite.getContainerElement());
      this.assertEquals("layout-card", className);

      var widget1 = new qx.ui.mobile.core.Widget();
      composite.add(widget1);

      var className = qx.bom.element.Class.get(widget1.getContainerElement());
      this.assertEquals("layout-card-item", className);
      
      this.assertFalse(widget1.isVisible());

      var widget2 = new qx.ui.mobile.core.Widget();
      composite.add(widget2);

      var className = qx.bom.element.Class.get(widget2.getContainerElement());
      this.assertEquals("layout-card-item", className);

      this.assertFalse(widget2.isVisible());
      
      widget1.show();
      this.assertTrue(widget1.isVisible());
      this.assertFalse(widget2.isVisible());
      
      widget2.show();
      this.assertFalse(widget1.isVisible());
      this.assertTrue(widget2.isVisible());

      widget1.destroy();
      widget2.destroy();
    },


    testShowWidget : function() {
      
    },
    
    
    testNext : function() {
      
    },


    testPrevious : function() {
      
    }
  }

});
