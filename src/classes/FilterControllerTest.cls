@isTest
private with sharing class FilterControllerTest {
	@isTest public static void FilterControllerTest() {
		Map<String, Object> objectInfo = (Map<String, Object>) JSON.deserializeUntyped(FilterController.getFieldData('Account', 'Type,CreatedDate,AnnualRevenue', 'CreatedDate,AnnualRevenue'));
		List<Object> fieldsInfoObj = (List<Object>) objectInfo.get('fields');

		//3 fields + 2 ranged fields
		System.assertEquals(5, fieldsInfoObj.size());
	}
}