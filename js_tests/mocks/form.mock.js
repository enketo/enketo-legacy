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
            "<somenodes>"+
                "<A>one</A>"+
                "<B>one</B>"+
                "<C>one</C>"+
            "</somenodes>"+
            "<someweights>"+
                "<w1>1</w1>"+
                "<w2>3</w2>"+
                "<w3>5</w3>"+
            "</someweights>"+
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

var dataStr2 =
    '<instance xmlns="http://www.w3.org/2002/xforms">'+
        '<random id="random"><formhub><uuid/></formhub>'+
          '<random__/>'+
          '<note_random/>'+
          '<uuid__/>'+
          '<note_uuid/>'+
          '<meta>'+
            '<instanceID/>'+
          '</meta>'+
        '</random>'+
      '</instance>';

var formStr2 =
    '<form class="jr">'+
        '<section class="form-logo"> </section>'+
        '<h2 id="form-title">Random<span></span></h2>'+
        '<div id="stats" style="display: none;">'+
            '<span id="jrSelect">0</span>'+
            '<span id="jrSelect1">0</span>'+
            '<span id="jrItem">0</span>'+
            '<span id="jrInput">2</span>'+
            '<span id="jrUpload">0</span>'+
            '<span id="jrTrigger">0</span>'+
            '<span id="jrRepeat">0</span>'+
            '<span id="jrRelevant">0</span>'+
            '<span id="jrConstraint">0</span>'+
            '<span id="jrCalculate">3</span>'+
            '<span id="jrPreload">0</span>'+
        '</div>'+
        '<label>'+
            '<input name="/random/meta/instanceID" type="hidden" data-calculate="(1+1)" />'+ /*******/
        '</label>'+
        '<fieldset class="trigger ui-state-highlight" name="/random/note_random">'+
            '<div class="question-icons"><span class="required"></span><span class="hint"></span></div>'+
            '<span lang="en" class="active">This is the random number that was generated: '+
                '<span class="jr-output" data-value="/random/random__"></span>'+
            '</span>'+
        '</fieldset>'+
        '<fieldset class="trigger ui-state-highlight" name="/random/note_uuid">'+
            '<div class="question-icons">'+
                '<span class="required"></span><span class="hint"></span>'+
            '</div>'+
            '<span lang="en" class="active">This is the uuid that was generated: '+
                '<span class="jr-output" data-value="/random/uuid__"></span>'+
            '</span>'+
        '</fieldset>'+
        '<fieldset id="jr-calculated-items" style="display:none;">'+
            '<label>'+
                '<input name="/random/formhub/uuid" type="hidden" data-calculate="string(9faaa6efd9bc48f9ab32d7ce5e9148d4)" data-type-xml="string"/>'+
            '</label>'+
            '<label>'+
                '<input name="/random/random__" type="hidden" data-calculate="random()" data-type-xml="string"/>'+
            '</label>'+
            '<label>'+
                '<input name="/random/uuid__" type="hidden" data-calculate="uuid()" data-type-xml="string"/>'+
            '</label>'+
        '</fieldset>'+
    '</form>';

var dataStr3 =
    '<instance xmlns="http://www.w3.org/2002/xforms">'+
        '<random id="random"><formhub><uuid/></formhub>'+
          '<random__/>'+
          '<note_random/>'+
          '<uuid__/>'+
          '<note_uuid/>'+
          '<meta>'+
            '<instanceID>c13fe058-3349-4736-9645-8723d2806c8b</instanceID>'+
          '</meta>'+
        '</random>'+
      '</instance>';

var formStr3 =
    '<form class="jr">'+
        '<section class="form-logo"> </section>'+
        '<h2 id="form-title">Random<span></span></h2>'+
        '<fieldset id="jr-preload-items" style="display:none;">'+ /*****/
            '<label>'+
                '<input name="/random/meta/instanceID" type="hidden" data-preload="instance" data-preload-params="id" data-type-xml="string" />'+
            '</label>'+
        '</fieldset>'+                                           /*****/
        '<fieldset class="trigger ui-state-highlight" name="/random/note_random">'+
            '<div class="question-icons"><span class="required"></span><span class="hint"></span></div>'+
            '<span lang="en" class="active">This is the random number that was generated: '+
                '<span class="jr-output" data-value="/random/random__"></span>'+
            '</span>'+
        '</fieldset>'+
        '<fieldset class="trigger ui-state-highlight" name="/random/note_uuid">'+
            '<div class="question-icons">'+
                '<span class="required"></span><span class="hint"></span>'+
            '</div>'+
            '<span lang="en" class="active">This is the uuid that was generated: '+
                '<span class="jr-output" data-value="/random/uuid__"></span>'+
            '</span>'+
        '</fieldset>'+
        '<fieldset id="jr-calculated-items" style="display:none;">'+
            '<label>'+
                '<input name="/random/formhub/uuid" type="hidden" data-calculate="string(9faaa6efd9bc48f9ab32d7ce5e9148d4)" data-type-xml="string"/>'+
            '</label>'+
            '<label>'+
                '<input name="/random/random__" type="hidden" data-calculate="random()" data-type-xml="string"/>'+
            '</label>'+
            '<label>'+
                '<input name="/random/uuid__" type="hidden" data-calculate="uuid()" data-type-xml="string"/>'+
            '</label>'+
        '</fieldset>'+
    '</form>';