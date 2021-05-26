'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))

let envVariables = {

  // Environment variables
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  sunbird_instance_name: env.sunbird_instance || 'Sunbird',
  DEFAULT_CHANNEL: env.sunbird_default_channel,
  

  // Application Start-up - Hosts and PORT Configuration
  PORTAL_PORT: env.sunbird_port || 3000,
  LEARNER_URL: env.sunbird_learner_player_url || 'https://dev.sunbirded.org/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://dock.sunbirded.org/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://dock.sunbirded.org',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://dev.sunbirded.org/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  PORTAL_API_AUTH_TOKEN: env.dock_api_auth_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiZDExNjYzN2Y5YjU0MWJiYjU3NDY3MTA2Yjk1YzllYSJ9.Bb8ThNzcBvhouPdtRa_UXnZgi3m2zZN5Skhke1_YlM0',
  SUNBIRD_PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token ||  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzZGNjMzY3OWIwYTE0NmU2YWYyZjlmZDA5NWU5NTlkNCJ9.0NZhX5sqUNy-GZUya90aQFkr5ZNiqfOuELYz_IvoyS8',
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://dev.sunbirded.org/api/echo/',
  CONFIG_URL: env.sunbird_config_service_url || 'https://dev.sunbirded.org/api/config/',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
  DEVICE_PROFILE_API: process.env.sunbird_device_profile_api || 'https://staging.open-sunbird.org/api/v3/device/profile/',
  sunbird_theme: env.sunbird_theme || 'default',
  BUILD_NUMBER: packageObj.version + '.' + packageObj.buildHash,
  sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
  sunbird_extcont_whitelisted_domains: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  sunbird_explore_button_visibility: env.sunbird_explore_button_visibility || 'true',
  sunbird_help_link_visibility: env.sunbird_help_link_visibility || 'false',
  sunbird_portal_user_upload_ref_link: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
  ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
  CONFIG_SERVICE_ENABLED: env.config_service_enabled || false,
  CRYPTO_ENCRYPTION_KEY: env.crypto_encryption_key || '030702bc8696b8ee2aa71b9f13e4251e',
  LOG_FINGERPRINT_DETAILS: env.sunbird_log_fingerprint_details || 'true',
  SUNBIRD_PORTAL_BASE_URL: env.sunbird_portal_base_url || 'https://dock.sunbirded.org',
  DOCK_CHANNEL: env.dock_channel || 'sunbird',
  sunbird_device_api: env.sunbird_device_api || 'https://staging.ntp.net.in/api/',
  dock_api_call_log_status: env.dock_api_call_log_status || false,
  SUNBIRD_PORTAL_URL: env.sunbird_portal_url,
  SUNBIRD_LEARNER_URL: env.sunbird_learner_url,
  DOCK_PROGRAM_SERVICE_URL: env.dock_program_service_url || 'https://dev.sunbirded.org',
  DOCK_QUESTIONSET_ENABLE: env.dock_questionSet_enable || 'true',

  // TTL and Intervals
  CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  RESPONSE_CACHE_TTL: env.sunbird_response_cache_ttl || '180', // used in tenant helper to cache the tenant response info
  sunbird_portal_updateLoginTimeEnabled:env.sunbird_portal_updateLoginTimeEnabled || false,


  // Telemetry Configuration
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',


  // Keycloak Configuration
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: env.sunbird_google_keycloak_client_id || 'google-auth',
    secret: env.sunbird_google_keycloak_secret || '8486df4b-2ec0-4249-92d8-5f3a7064cd07'
  },
  KEYCLOAK_GOOGLE_ANDROID_CLIENT: {
    clientId: env.sunbird_google_android_keycloak_client_id,
    secret: env.sunbird_google_android_keycloak_secret
  },
  KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT: {
    clientId: env.sunbird_trampoline_android_keycloak_client_id,
    secret: env.sunbird_trampoline_android_keycloak_secret
  },
  KEYCLOAK_ANDROID_CLIENT: {
    clientId: env.sunbird_android_keycloak_client_id || 'android',
  },
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_MERGE_AUTH_SERVER_URL: env.sunbird_portal_merge_auth_server_url || 'https://merge.staging.open-sunbird.org/auth',


  // Social login Configuration
  GOOGLE_OAUTH_CONFIG: {
    clientId: env.sunbird_google_oauth_clientId || '671624305038-e8pbpmidst6lf0j5qplp6g6odan3lbf5.apps.googleusercontent.com' || '903729999899-7vcrph3vro36ot43j1od8u6he9jjend0.apps.googleusercontent.com',
    clientSecret: env.sunbird_google_oauth_clientSecret || 'mDO2MM68iW23f47ZFtvREld9' || 'BAEAYRv7voTByz5rOKkbIE3u'
  },
  sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key || '6Ldcf4EUAAAAAMrKQSviNtEzMretoDgeAUxqJv7d',
  google_captcha_private_key: env.google_captcha_private_key,


  // Android Configuration
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',


  // BLOB and Storage Configuration
  PORTAL_CLOUD_STORAGE_URL: env.portal_cloud_storage_url,
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: env.sunbird_cassandra_consistency_level || 'one',
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: env.sunbird_cassandra_replication_strategy || '{"class":"SimpleStrategy","replication_factor":1}',
  sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
  sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbirddev',
  sunbird_azure_account_key: 'k8NzvVqH0WSwCARJZo2h6G28AT2775MbrhMi9Akt4HNdYH009WVWmjjs31L08VEMnvRxas1DU7UM3/KtuMxpVg==',
  sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
  sunbird_portal_video_max_size: env.sunbird_portal_video_max_size || '50',


  // Default Language Configuration
  sunbird_default_language: env.sunbird_portal_default_language || 'en',
  sunbird_primary_bundle_language: env.sunbird_portal_primary_bundle_language || 'en',


  // Service(s) Base URL(s)
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content-service:5000',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://dock.sunbirded.org/api/',
  PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',
  kp_content_service_base_url: env.sunbird_kp_content_service_base_url || 'http://content-service:9000/',
  kp_learning_service_base_url: env.sunbird_kp_learning_service_base_url,
  kp_assessment_service_base_url: env.sunbird_kp_assessment_service_base_url || 'http://assessment-service:9000/',


  // Health Checks Configuration
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',


  // Desktop App Configuration
  sunbird_portal_offline_tenant: env.sunbird_portal_offline_tenant,
  sunbird_portal_offline_supported_languages: env.sunbird_portal_offline_supported_languages,
  sunbird_portal_offline_app_release_date: env.sunbird_portal_offline_app_release_date,
  sunbird_portal_offline_app_version: env.sunbird_portal_offline_app_version,
  sunbird_portal_offline_app_download_url: env.sunbird_portal_offline_app_download_url,
  DESKTOP_APP_STORAGE_URL: env.desktop_app_storage_url,
 

  // CDN Configuration
  PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  sunbird_portal_preview_cdn_url: env.sunbird_portal_preview_cdn_url,


  // Kafka Configuration
  sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
  sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic
}

envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
  ? env.sunbird_cassandra_urls.split(',') : ['localhost']

module.exports = envVariables

