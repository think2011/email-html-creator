function escapeSelector (selector) {
    return selector.replace(/([ \!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;<\=\>\?\@\[\\\]\^\`\{\|\}\~])/g, '\\$1');
};

JSONForm.fieldTypes['zyDropdown'] = {
    'template'     : '<select name="<%= node.name %>" id="<%= id %>"' +
    '<%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' +
    '<%= (node.disabled? " disabled" : "")%>' +
    '<%= (node.formElement && node.formElement.width ? " data-width=\'"+node.formElement.width+"\'" : "") %>' +
    '<%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "") %>' +
    '> ' +
    '<% _.each(node.options, function(key, val) { ' +
    'if(key instanceof Object) { if (value === key.value) { %>' +
    ' <option selected value="<%= key.value %>"><%= key.title %></option> <% } ' +
    'else { %> <option value="<%= key.value %>"><%= key.title %></option> <% }} ' +
    'else { if (value === key) { %> ' +
    '<option selected value="<%= key %>"><%= key %></option> <% } ' +
    'else { %><option value="<%= key %>"><%= key %></option> <% }}}); %> ' +
    '</select>',
    'fieldtemplate': true,
    'inputfield'   : true,

    onInsert: function (evt, node) {
        setTimeout(function () {
            $(node.el).find('#' + escapeSelector(node.id)).zyDropdown();
        }, 0);
    }
};

JSONForm.fieldTypes['boxpicker'] = {
    'template'     : '<select name="<%= node.name %>" id="<%= id %>"' +
    '<%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' +
    '<%= (node.disabled? " disabled" : "")%>' +
    '<%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "") %>' +
    '> ' +
    '<% _.each(node.options, function(key, val) { ' +
    'if(key instanceof Object) { if (value === key.value) { %>' +
    ' <option selected value="<%= key.value %>"><%= key.title %></option> <% } ' +
    'else { %> <option value="<%= key.value %>"><%= key.title %></option> <% }} ' +
    'else { if (value === key) { %> ' +
    '<option selected value="<%= key %>"><%= key %></option> <% } ' +
    'else { %><option value="<%= key %>"><%= key %></option> <% }}}); %> ' +
    '</select>',
    'fieldtemplate': true,
    'inputfield'   : true,
    onInsert       : function (evt, node) {
        setTimeout(function () {
            $(node.el).find('#' + escapeSelector(node.id)).boxpicker();
        }, 0);
    }
};


JSONForm.fieldTypes['zyColorSelector'] = {
    'template'     : '<select name="<%= node.name %>" id="<%= id %>"' +
    '<%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' +
    '<%= (node.disabled? " disabled" : "")%>' +
    '<%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "") %>' +
    '> ' +
    '<% _.each(node.options, function(key, val) { ' +
    'if(key instanceof Object) { if (value === key.value) { %>' +
    ' <option selected value="<%= key.value %>"><%= key.title %></option> <% } ' +
    'else { %> <option value="<%= key.value %>"><%= key.title %></option> <% }} ' +
    'else { if (value === key) { %> ' +
    '<option selected value="<%= key %>"><%= key %></option> <% } ' +
    'else { %><option value="<%= key %>"><%= key %></option> <% }}}); %> ' +
    '</select>',
    'fieldtemplate': true,
    'inputfield'   : true,
    onInsert       : function (evt, node) {
        setTimeout(function () {
            $(node.el).find('#' + escapeSelector(node.id)).zyColorSelector();
        }, 0);
    }
};