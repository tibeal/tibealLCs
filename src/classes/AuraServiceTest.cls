@isTest
private with sharing class AuraServiceTest {
	
	@isTest
	private static void testGetFieldDescribe() {
		Map<String, DescribeFieldResult> fieldDescribeMap = AuraService.getFieldsDescribe('Account',new List<String>{'Name','AccountNumber','AccountSource','AnnualRevenue'});

		System.assert(fieldDescribeMap.keySet().contains('Name'));
		System.assert(fieldDescribeMap.keySet().contains('AccountNumber'));
		System.assert(fieldDescribeMap.keySet().contains('AccountSource'));
		System.assert(fieldDescribeMap.keySet().contains('AnnualRevenue'));
	}

	@isTest
	private static void testGetFieldData() {
		Map<String, Object> objectInfo = (Map<String, Object>) JSON.deserializeUntyped(AuraService.getFieldData('Account', 'Name,AccountNumber,AccountSource,AnnualRevenue'));
		List<Object> fieldsInfoObj = (List<Object>) objectInfo.get('fields');

		System.assertEquals(4, fieldsInfoObj.size());
	}

	@isTest
	private static void testGetImages() {
		MockUpFactory.createData();

		List<Account> accounts = [SELECT Id From Account LIMIT 1];

		List<Object> images = AuraService.getImages(accounts[0].Id);

		System.assert(!images.isEmpty());
	}
}