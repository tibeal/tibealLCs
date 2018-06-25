({
    getTypes: function(component) {
        var fieldInfo = component.get('v.fieldset');
        var fieldTypes = {};
        [].forEach.call(fieldInfo, function(info) {
            fieldTypes[info.attributes.name] = info.attributes.type;
        });
        component.set('v.fieldTypes', fieldTypes);
    },
    getFieldMap: function(component) {
        var fieldInfo = component.get('v.fieldset');
        var fieldMap = {};
        [].forEach.call(fieldInfo, function(info) {
            fieldMap[info.attributes.name] = info;
        });
        component.set('v.fieldMap', fieldMap);
    },
    assembleWhereClause : function(component, filterObject) {
        try {
            var whereConditions = [];
            var whereCondition;
            var fieldTypes = component.get('v.fieldTypes');
            var fieldMap = component.get('v.fieldMap');
            var rangedFields = component.get('v.rangedFields').split(',');
            [].forEach.call(Object.keys(filterObject), function(filterField) {
                if (filterObject[filterField] != '' && filterObject[filterField] != null && filterObject[filterField] != undefined) {
                    if (filterField.indexOf('-to') == -1) {
                        if (rangedFields.indexOf(filterField) == -1) {
                            if (fieldMap[filterField].attributes.type != 'id' && fieldMap[filterField].attributes.inputType == 'text') {
                                whereConditions.push(this.getWhereClause(filterField, filterObject[filterField].replace(new RegExp('\\*','g'),'%'), 'like', fieldTypes));    
                            } else {
                                whereConditions.push(this.getWhereClause(filterField, filterObject[filterField], '=', fieldTypes));
                            }
                        } else {
                            whereCondition = ' ( ';
                            whereCondition += this.getWhereClause(filterField, filterObject[filterField], '>=', fieldTypes);
                            if (filterObject[filterField + '-to']) {
                                whereCondition += ' AND ' + this.getWhereClause(filterField, filterObject[filterField + '-to'], '<=', fieldTypes);
                            }
                            whereCondition += ' ) ';
                            whereConditions.push(whereCondition);
                        }
                    } else if (filterField.indexOf('-to') != -1) {
                        var fieldFrom = filterObject[filterField.replace('-to','')];
                        if (fieldFrom == '' || fieldFrom == null || fieldFrom == undefined) {
                            whereConditions.push(this.getWhereClause(filterField.replace('-to',''), filterObject[filterField], '<=', fieldTypes));    
                        }
                    }
                }
            }, this);
            return whereConditions.join(' AND ');
        } catch(e) {
            console.log(e);
        }
    },
    isQuoted: {
        'address': true,
        'anytype': true,
        'base64': true,
        'boolean': false,
        'combobox': false,
        'currency': false,
        'datacategorygroupreference': false,
        'date': false,
        'datetime': false,
        'double': false,
        'email': true,
        'encryptedstring': true,
        'id': true,
        'integer': false,
        'multipicklist': true,
        'percent': false,
        'phone': true,
        'picklist': true,
        'reference': true,
        'string': true,
        'textarea': true,
        'time': false,
        'url': true
    },
    getWhereClause: function(fieldName, fieldValue, operator, fieldTypes) {
        try{
            var whereClause = '';
            if (fieldValue != null && fieldValue != '' && fieldValue != undefined) {
                if (this.isQuoted[fieldTypes[fieldName]]) {
                    if (fieldTypes[fieldName] != 'string' && fieldTypes[fieldName] != 'textarea') {
                    	whereClause = fieldName + ' ' + operator + ' \'\'' + fieldValue.replace(new RegExp('\'','g'),'\\\'\'') + '\'\'';    
                    } else {
                        whereClause = fieldName + ' LIKE \'\'%' + fieldValue.replace(new RegExp('\'','g'),'\\\'\'') + '%\'\'';
                    }
                }else {
                    whereClause = fieldName + ' ' + operator + ' ' + fieldValue + '';
                }    
            }
            return whereClause;    
        } catch(e) {
            console.log(e);
        }
    }
})