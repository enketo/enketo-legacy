var dataStr1 =
    "<instance>"+
        "<thedata id='something'>"+
            "<nodeA />"+
            "<nodeB>b</nodeB>"+
            "<repeatGroup template=''>"+
                "<nodeC>cdefault</nodeC>"+
            "</repeatGroup>"+
            "<repeatGroup>"+
                "<nodeC />"+
            "</repeatGroup>"+
            "<repeatGroup>"+
                "<nodeC>c2</nodeC>"+
            "</repeatGroup>"+
            "<repeatGroup>"+
                "<nodeC>c3</nodeC>"+
            "</repeatGroup>"+
        "</thedata>"+
    "</instance>";

var formStr1 =
    '<form>'+
        '<fieldset class="jr-group">'+
            '<fieldset class="jr-repeat" name="/thedata/repeatGroup">'+
                '<input name="/thedata/repeatGroup/nodeC" />'+
            '</fieldset>'+
            '<fieldset class="jr-repeat" name="/thedata/repeatGroup">'+
                '<input name="/thedata/repeatGroup/nodeC" />'+
            '</fieldset>'+
            '<fieldset class="jr-repeat" name="/thedata/repeatGroup">'+
                '<input name="/thedata/repeatGroup/nodeC" />'+
            '</fieldset>'+
        '</fieldset>'+
    '</form>';

