/* eslint no-console:0 */
const rp = require('request-promise-native');
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');

const API_GROUP = "networking.istio.io";
const API_VERSION = "v1alpha3";

const virtualService = yaml.safeLoad(fs.readFileSync('./istio/header-routing-virtual-service.yaml', 'utf8'));
const destinationRule = yaml.safeLoad(fs.readFileSync('./istio/header-routing-destination-rule.yaml', 'utf8'));

const VIRTUAL_SERVICES_KIND_PLURAL = 'virtualservices';
const DESTINATION_RULES_KIND_PLURAL = 'destinationrules';

async function deleteObject (config, apiGroup, apiVersion, kindPlural, objectName) {
  const baseUri = `apis/${apiGroup}/${apiVersion}/namespaces/${config.namespace}/${kindPlural}`;
  var options = {
    agentOptions: {
      ca: config.ca
    },
    rejectUnauthorized: false,
    method: 'DELETE',
    uri: config.url + '/' + baseUri + '/' + objectName,
    headers: {
      'Authorization': 'Bearer ' + config.auth.bearer
    },
    json: true // Automatically parses the JSON string in the response
  };

  return await rp(options);
}

async function createObject (config, apiGroup, apiVersion, kindPlural, object) {
  const baseUri = `apis/${apiGroup}/${apiVersion}/namespaces/${config.namespace}/${kindPlural}`;
  var options = {
    agentOptions: {
      ca: config.ca
    },
    rejectUnauthorized: false,
    method: 'POST',
    body: object,
    uri: config.url + '/' + baseUri,
    headers: {
        'Authorization': 'Bearer ' + config.auth.bearer
    },
    json: true // Automatically parses the JSON string in the response
  };

  return await rp(options);
}

async function main () {
  try {

    const _config = config.getInCluster();

    try {
        const virtualServiceDeleted = await deleteObject(_config, API_GROUP, API_VERSION, VIRTUAL_SERVICES_KIND_PLURAL, virtualService.metadata.name);
        console.log('virtualServiceDeleted: ', virtualServiceDeleted);
    } catch (err) {
      console.warn('virtualServiceDelete Error', err);
    }

    try {
      const destinationRuleDeleted = await deleteObject(_config, API_GROUP, API_VERSION, DESTINATION_RULES_KIND_PLURAL, destinationRule.metadata.name);
      console.log('destinationRuleDeleted: ', destinationRuleDeleted);
    } catch (err) {
      console.warn('destinationRuleDelete Error', err);
    }
    
    const virtualServiceCreated = await createObject(_config, API_GROUP, API_VERSION, VIRTUAL_SERVICES_KIND_PLURAL, virtualService);
    //console.log('virtualServiceCreated: ', virtualServiceCreated);

    const destinationRuleCreated = await createObject(_config, API_GROUP, API_VERSION, DESTINATION_RULES_KIND_PLURAL, destinationRule);
    //console.log('destinationRuleCreated: ', destinationRuleCreated);

    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyHeaderRouting = main;