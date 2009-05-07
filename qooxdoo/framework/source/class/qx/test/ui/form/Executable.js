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
     * Martin Wittemann (martinwittemann)

************************************************************************ */
qx.Class.define("qx.test.ui.form.Executable",
{
  extend : qx.test.ui.LayoutTestCase,

  members :
  {
    __test: function(widget) {
      // check if the interface is implemented
      this.assertTrue(qx.Class.hasInterface(widget.constructor, qx.ui.form.IExecutable), "Interface is not implemented.");
      
      var command = new qx.event.Command();
      
      // check if the setter works
      widget.setCommand(command);
      this.assertEquals(command, widget.getCommand(), "Setter / Getter not working.");
      
      // check the event and execute method
      this.assertEventFired(widget, "execute", function() {
        widget.execute();
      }, function(e) {
        // do nothgin
      }, "Execute event on the widget is wrong!");
      
      this.assertEventFired(command, "execute", function() {
        widget.execute();
      }, function(e) {
        // do nothgin
      }, "Execute event on the command is wrong!");      
    },
    
    testToggleButton: function() {
     this.__test(new qx.ui.form.ToggleButton()); 
    },
    
    testCheckBox: function() {
     this.__test(new qx.ui.form.CheckBox()); 
    },
    
    testButton: function() {
     this.__test(new qx.ui.form.Button()); 
    },
   
    testRepeatButton: function() {
     this.__test(new qx.ui.form.RepeatButton()); 
    },
    
    testMenuButton: function() {
     this.__test(new qx.ui.form.MenuButton()); 
    },
    
    testRadioButton: function() {
     this.__test(new qx.ui.form.RadioButton()); 
    },
    
    testToolbarButton: function() {
     this.__test(new qx.ui.toolbar.Button()); 
    },
    
    testSplitButton: function() {
     this.__test(new qx.ui.toolbar.SplitButton()); 
    },
    
    testMenuCheckBox: function() {
     this.__test(new qx.ui.menu.CheckBox()); 
    },
    
    testRadioButton: function() {
     this.__test(new qx.ui.form.RadioButton()); 
    }    
  }
});