public  class LookupSearchController {
	@AuraEnabled
	public static List<sObject> getRecords(String fields, String sObjectName, String whereClause, Decimal quantity, Decimal offset, String orderBy) {
		try{
            List<SObject> result = new List<SObject>();
			Set<String> fieldSet = new Set<String>(fields != null && fields != '' ? fields.split(',') : new List<String>());
			String query = 'SELECT {0} FROM {1} {2} ORDER BY {3} LIMIT {4} OFFSET {5}';

			query = String.format(query, new List<String>{
				String.join(new List<String>(fieldSet),','),
				sObjectName,
                    whereClause != null && whereClause != ''? 'WHERE ' + (whereClause.contains('\'\'') ? whereClause.replace('\'\'','\'') : whereClause) : '',
				String.valueOf(orderBy),
				String.valueOf(quantity),
				String.valueOf(offset)
				}
			);

			System.debug(query);

			result = Database.query(query);

			return result;
        } catch (DmlException e) {
            throw new AuraHandledException(e.getDmlMessage(0));
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return null;
	}
}