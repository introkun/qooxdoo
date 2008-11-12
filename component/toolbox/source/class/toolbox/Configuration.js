/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Yuecel Beser (ybeser)

************************************************************************ */

/* ************************************************************************
#asset(toolbox/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "HelloWorld"
 */
qx.Class.define("toolbox.Configuration",
{
  extend : qx.core.Object,

    /*
      *****************************************************************************
         CONSTRUCTOR
      *****************************************************************************
    */
  construct : function(adminPath, fileName, filePath) {
  		this.base(arguments, adminPath, fileName, filePath);
  		this.__urlParms = new toolbox.UrlSearchParms();
  		this.__showConfiguration(adminPath, fileName, filePath);
  },

    /*
      *****************************************************************************
         MEMBERS
      *****************************************************************************
    */

  members :
  {
    __showConfiguration : function(adminPath, fileName, filePath) {
    	if (fileName != "" & filePath!=""){
      	var url = adminPath;
        var req = new qx.io.remote.Request(url, "POST");
        var req2 = new qx.io.remote.Request(url, "POST");
        var dat = "action=show_Configuration";
        var saveDat = "action=save_Configuration";
        var createParams = [fileName, filePath];
        req.setTimeout(1000000);

        // check cygwin path
        if ('cygwin' in this.__urlParms.getParms())
        {
          var cygParm = 'cygwin'+"="+this.__urlParms.getParms()['cygwin'];
          dat += "&"+cygParm;
        }
        var params = ["myName", "myPath"];
        
        for(var i = 0; i < createParams.length; i++) {
        	if(createParams[i] != "") {
            dat +="&"+params[i]+"=" + createParams[i];
            saveDat +="&"+params[i]+"=" + createParams[i];
        	}
        }
        
        req.setProhibitCaching(true);
        req.setData(dat);
        
  
        req.addListener("completed", function(evt)
        {
          var result = evt.getContent();
          
          var vBoxLayout = new qx.ui.layout.VBox(5);
          vBoxLayout.setAlignX("right");
          
          var gridLayout = new qx.ui.layout.Grid(5, 5);
          gridLayout.setRowFlex(0, 1);
          gridLayout.setRowFlex(1, 1);          
          gridLayout.setColumnFlex(0, 1);
          var mainContainer = new qx.ui.container.Composite(gridLayout);
          
          
          var container = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({
            allowGrowX: false
          });
   
          this.win = new qx.ui.window.Window("Configuration");
          this.win.setModal(true);
          this.win.setLayout(vBoxLayout);
          //this.win.setAllowGrowY(false);
          //this.win.setAllowMaximize(false);
          //this.win.setAllowGrowX(true);
          
          
         
            //--------Buttons-----------------------------------------------------
            var saveButton = new qx.ui.form.Button("Save", "toolbox/image/media-floppy.png");
            var closeButton = new qx.ui.form.Button("Close", "toolbox/image/dialog-close.png");
            //--------Buttons-----------------------------------------------------
  
            //--------Textarea----------------------------------------------------
            var configFrame = new qx.ui.form.TextArea("");
            configFrame.setMinWidth(400);
            configFrame.setWrap(false);
            configFrame.setAllowGrowX(true);
            configFrame.setAllowGrowY(true);
            configFrame.setAllowStretchX(true);
            configFrame.setAllowStretchY(true);
            configFrame.setValue(result);
            configFrame.setMinHeight(400);
            //--------Textarea----------------------------------------------------
            
            
            
            
            //###################################################################
            //#####################################################################
            //#####################################################################
            //#####################################################################
            
            var analyzer = new toolbox.JsonAnalyzer();
            result = eval("("+ result +")");
            var root = analyzer.createJsonTree(result);
            
            //#####################################################################
            //#####################################################################
            //#####################################################################
            //#####################################################################
       


            container.add(closeButton);
            container.add(saveButton);
            
            
            
            
          tabView = new qx.ui.tabview.TabView();
	        
	
	        var page1 = new qx.ui.tabview.Page("JSON-settings", null);
	        page1.setLayout(new qx.ui.layout.VBox());
	        page1.add(new qx.ui.basic.Label("JSON-tree"));
	        tabView.add(page1);
	

	        var page2 = new qx.ui.tabview.Page("Professional view", null);
	        page2.setLayout(new qx.ui.layout.VBox());
	        page2.add(new qx.ui.basic.Label("Config.js"));
	        tabView.add(page2);
            
            
            
            analyzer.getTree().setRoot(root);
            
            mainContainer.add(analyzer.getTree(), {
              row     : 0,
              column  : 0,
              rowSpan : 0,
              colSpan : 1
            });
            
            
            mainContainer.add(analyzer.getCommandFrame(analyzer.getTree()), {
              row     : 1,
              column  : 0,
              rowSpan : 0,
              colSpan : 1
            });


            page1.add(mainContainer);
            page2.add(configFrame);
            
            this.win.add(tabView, {flex: 1});
            this.win.add(container);

            closeButton.addListener("execute", function() {
              this.win.close();
            }, this);
            
            saveButton.addListener("execute", function() {
              try{
                changedConfig = configFrame.getValue();
                qx.util.Json.parse(changedConfig);
                saveDat += "&changedConfig=" + changedConfig 
                req2.setData(saveDat);
                req2.send();
              } catch (err) {
                alert(err);
              }
              this.win.close();
            }, this);
            
            this.win.open(); 
            this.win.moveTo(200, 100);
          

          this.setResult(result);   

        },
        this);
        
        req2.addListener("completed", function(evt)
        {
        	 saveResult = evt.getContent();
        }, this);
      

        req.addListener("failed", function(evt) {
          this.error("Failed to post to URL: " + url);
        }, this);
  
        req.send();
    	} else {
    		alert("You don't created an application");
    	}
      return;
    },
    
    
    setState : function(state) {
      this.__state = state;
    }, 

    getState : function() {
      return this.__state;
    },
    
    setResult : function(content) {
      this.__content = content;
    }, 

    getResult : function() {
      return this.__content;
    },
    
    
    destruct : function()
    {
      //this._disposeFields("widgets");
      this._disposeObjects("this.win", "this.__content", "this.__state");
    }
    
    

    
    
  }
});