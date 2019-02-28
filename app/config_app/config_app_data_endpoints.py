# -*- encoding: utf-8 -*-

from . import version

default_data_endpoints_config = [
	### - - - - - - - - - - - - - - - ###
	### USER MANAGEMENT
	### - - - - - - - - - - - - - - - ###

	### CONFIRM JWT
	{ "field"    	  	: "app_data_API_user_auth",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for user authentication (confirm acces)",
		"root_url"			: "http://localhost:4100/api/auth/tokens/confirm_access",
		"args_options"	: [
			{ "arg" : "token", 		"optional" : False, "in" : ["url","header"], "default" : "", "type" : "str" },
		],
		"app_version"   : version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint for a JWT check",
    "is_default"  	: True
	},

	### NEW ACCESS JWT
	{ "field"    	  	: "app_data_API_user_new_access_token",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for user authentication (new acces token) : needs a valid refresh token as token ",
		"root_url"			: "http://localhost:4100/api/auth/tokens/new_access_token",
		"args_options"	: [
			{ "arg" : "token", 		"optional" : False, "in" : ["url","header"], "default" : "", "type" : "str" },
		],
		"app_version"   : version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint for a new access JWT ",
    "is_default"  	: True
	},

	### REGISTER
	{ "field"    	  	: "app_data_API_user_register",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for registering a new user",
		"root_url"			: "http://localhost:4100/api/usr/register/",
		"args_options"	: [
		],
		"app_version"   : version,
		"method"				: "POST",
    "help"      	  : u"define the endpoint for registering a new user",
		"needs_form"		: True,
    "is_default"  	: True
	},

	### LOGIN
	{ "field"    	  	: "app_data_API_user_login",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for login",
		"root_url"			: "http://localhost:4100/api/auth/login/",
		"args_options"	: [
		],
		"app_version"   : version,
		"method"				: "POST",
    "help"      	  : u"define the endpoint for login an user",
		"needs_form"		: True,
    "is_default"  	: True
	},

	### USER LIST
	{ "field"    	  	: "app_data_API_user_list",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for users list",
		"root_url"			: "http://localhost:4100/api/usr/infos/list",
		"args_options"	: [
			{ "arg" : "token", 		"optional" : False, "in" : ["url","header"], 	"default" : "", "type" : "str" },
			{	"arg" : "page_n", 	"optional" : True, 	"in" : ["url"], 					"default" : 1, 	"type": "int" }, 
			{	"arg" : "per_page", "optional" : True, 	"in" : ["url"], 					"default" : 50, "type": "int" }, 
		],
		"app_version"   : version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint to get data for : an user ",
    "is_default"  	: True
	},

	### USER INFOS
	{ "field"    	  	: "app_data_API_user_infos",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for user infos",
		"root_url"			: "http://localhost:4100/api/usr/infos/get_one/",
		"args_options"	: [
			{ "arg" : "token", 		"optional" : False, "in" : ["url","header"], 	"default" : "", "type" : "str" },
			{ "arg" : "doc_id", 	"optional" : True, 	"in" : ["url"], 					"default" : "", "type" : "str"}
		],
		"app_version"   : version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint to get data for : an user ",
    "is_default"  	: True
	},

	### USER EDIT
	{ "field"    	  	: "app_data_API_user_edit",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for editing an user",
		"root_url"			: "http://localhost:4100/api/auth/edit/",
		"args_options"	: [
			{ "arg" : "token", 		"optional" : False, "in" : ["url","header"], 	"default" : "", "type" : "str" },
			{ "arg" : "doc_id", 	"optional" : True, 	"in" : ["url"], 					"default" : "", "type" : "str"}
		],
		"app_version"   : version,
		"method"				: "PUT",
    "help"      	  : u"define the endpoint to get data for : an user ",
		"needs_form"		: True,
    "is_default"  	: True
	},

	### USER DELETE
	{ "field"    	  	: "app_data_API_user_delete",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for deleting an user",
		"root_url"			: "http://localhost:4100/api/auth/edit/",
		"args_options"	: [
			{ "arg" : "token", 		"optional" : False, "in" : ["url","header"], 	"default" : "", "type" : "str" },
			{ "arg" : "doc_id", 	"optional" : True, 	"in" : ["url"], 					"default" : "", "type" : "str"}
		],
		"app_version"   : version,
		"method"				: "DELETE",
    "help"      	  : u"define the endpoint to get data for : an user ",
    "is_default"  	: True
	},

	### USER FORGOT PWD
	{ "field"    	  	: "app_data_API_forgot_pwd",
		"data_type" 		: "user",
		"content"   	  : u"apiviz default API endpoint for changing password",
		"root_url"			: "http://localhost:4100/api/auth/password/password_forgotten",
		"args_options"	: [
		],
		"app_version"   : version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint to get data for : an user ",
		"needs_form"		: True,
    "is_default"  	: True
	},

	### - - - - - - - - - - - - - - - ###
	### DATA ENDPOINTS
	### - - - - - - - - - - - - - - - ###

	### DATA FILTERS --> TO DO IN SOLIDATA
	{ "field"     	  : "app_data_API_filters",
		"data_type" 		: "data",
		"content"   	  : u"apiviz default API endpoint for navbar filters",
		"root_url"			: "http://cis-openscraper/api/filters",
		"args_options" 	: [
			{	"arg" : "token", 	"optional" : True, "in" : ["url","header"], 	"default" : "", "type": "str" }, 
		],
		"app_version"		: version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint to get data for : filters in search navbar",
    "is_default"		: True
	},

	### DATA LIST
	{ "field"     	  : "app_data_API_list",
		"data_type" 		: "data",
		"content"   	  : u"apiviz default API endpoint for list results",
		"root_url"			: "http://cis-openscraper/api/data",
		"args_options" 	: [
			{	"arg" : "token", 						"optional" : True, "in" : ["url","header"], 	"default" : "", "type": "str" }, 
			{	"arg" : "spider_id", 				"optional" : True, "in" : ["url"], 					"default" : "", "type": "str" },
			{	"arg" : "page_n", 					"optional" : True, "in" : ["url"], 					"default" : 1, 	"type": "int" }, 
			{	"arg" : "results_per_page", "optional" : True, "in" : ["url"], 					"default" : 50, "type": "int" }, 
		],
		"app_version"		: version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint to get data for : a view list",
    "is_default"		: True
	},

	### DATA DETAIL
	{ "field"     	  : "app_data_API_detail",
		"data_type" 		: "data",
		"content"   	  : u"apiviz default API endpoint for detailled results",
		"root_url"			: "http://cis-openscraper/api/data",
		"args_options" 	: [
			{	"arg" : "token", 		"optional" : True, "in" : ["url","header"], 	"default" : "", "type": "str" }, 
			{	"arg" : "item_id", 	"optional" : True, "in" : ["url"], 					"default" : "", "type": "str" }, 
		],
		"app_version"		: version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint to get data for : a detailled data",
    "is_default"		: True
	},

	### DATA STATS
	{ "field"     	  : "app_data_API_stats",
		"data_type" 		: "data",
		"content"   	  : u"apiviz default API endpoint for stats results",
		"root_url"			: "http://cis-openscraper/api/infos",
		"args_options" 	: [
			{	"arg" : "token", 								"optional" : True, "in" : ["url","header"], 	"default" : "", "type": "str" }, 
			{	"arg" : "only_counts_simple", 	"optional" : True, "in" : ["url"], 					"default" : "", "type": "bool" }, 
			{	"arg" : "only_tags_stats", 			"optional" : True, "in" : ["url"], 					"default" : "", "type": "bool" }, 
			{	"arg" : "only_spiders_stats", 	"optional" : True, "in" : ["url"], 					"default" : "", "type": "bool" }, 
		],
		"app_version"		: version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint to get data for : a stat about the dataset",
    "is_default"		: True
	},

	### DATA MAP
	{ "field"     	  : "app_data_API_map",
		"data_type" 		: "data",
		"content"   	  : u"apiviz default API endpoint for map results",
		"root_url"			: "http://cis-openscraper/api/data",
		"args_options" 	: [
			{	"arg" : "token", 						"optional" : True, "in" : ["url","header"], 	"default" : "", "type": "str" }, 
			{	"arg" : "page_n", 					"optional" : True, "in" : ["url"], 					"default" : "", "type": "int" }, 
			{	"arg" : "results_per_page", "optional" : True, "in" : ["url"], 					"default" : "", "type": "int" }, 
			{	"arg" : "spider_id", 				"optional" : True, "in" : ["url"], 					"default" : "", "type": "str" },
		],
		"app_version"		: version,
		"method"				: "GET",
    "help"      	  : u"define the endpoint to get data for : map results",
    "is_default"		: True
	},

]