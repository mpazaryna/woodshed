Ext.onReady(function() { 
   Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';
   Ext.QuickTips.init();    
   Ext.form.VTypes.nameVal  = /^[A-Z][A-Za-z]+\s[A-Z][A-Za-z]+$/;
   Ext.form.VTypes.nameMask = /[A-Za-z ]/;
   Ext.form.VTypes.nameText = 'Invalid Director Name.';
   Ext.form.VTypes.name     = function(v){
      return Ext.form.VTypes.nameVal.test(v);
   };

   var genres = new Ext.data.ArrayStore({
     fields: ['id', 'genre_name'],
     data: [['0','New Category'],['1','Comedy'],['2','Drama'],['3','Action'],['4','Documentary']]});

   var genres_remote = new Ext.data.Store({
      reader: new Ext.data.JsonReader({
        fields: ['id', 'genre_name'],
        root: 'rows'
      }),
      proxy: new Ext.data.ScriptTagProxy({
        url:'http://wisesmile-dev.s3.amazonaws.com/hills/extjs/learning_3.2/chap3/genres.json'
      }),
      autoLoad: true
   });
      
   var movie_form = new Ext.FormPanel ({
     url: 'movie-form-submit.php',
     renderTo: Ext.getBody(),
     frame: true,
     title: 'Movie Information Form',
     width: 250,
     items:  [{ 
        xtype: 'textfield', 
        fieldLabel: 'Title', 
        name: 'title', 
        allowBlank: false
     },{ 
        xtype: 'textfield', 
        fieldLabel: 'Director', 
        name: 'director', 
        vtype: 'name'
     },{ 
        xtype: 'datefield', 
        fieldLabel: 'Released', 
        name: 'released', 
        disabledDays:[0,6] 
     },{
        xtype: 'radiogroup',
        columns: 1,
        fieldLabel: 'Filmed In',
        name: 'filmed_in',
        items: [
           { name: 'filmed_in',
             boxLabel: 'Color',
             inputValue: 'color'},
           { name: 'filmed_in',
             boxLabel: 'Black & White',
             inputValue: 'B&W'}
        ]
     },{
        xtype: 'checkbox',
        fieldLabel: 'Bad Movie',
        name: 'bad_movie'
     },{
        xtype: 'combo',
        hiddenName: 'genre',
        fieldLabel: 'Genre',
        mode: 'local',
        store: genres,
        displayField: 'genre_name',
        valueField:'id',
        width: 120,
        listeners: {
          select: function(field,rec,selIndex){
            if (selIndex == 0) {
              Ext.Msg.prompt('New Genre', 'Name', Ext.emptyFn);
            }   
          }
        }
     },{
        xtype: 'htmleditor',
        name: 'description',
        hideLabel: true,
        height: 100,
        anchor:'100%'   
     }],
     buttons: [{
        text: 'Save',
        handler: function() {
            movie_form.getForm().submit({
                success: function(form, action){
                    Ext.Msg.alert('Success', 'It worked');
                },
                failure: function(form, action){
                    Ext.Msg.alert('Fail', 'It did not work');
                
                }
            });
                }
            }, {
                text: 'Reset',
                handler: function(){
                    movie_form.getForm().reset();
                }
    }]
  });
});