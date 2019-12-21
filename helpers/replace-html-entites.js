

module.exports.replaceHtmlEntites = (str) => {
	if (!str) return str;
	
	var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	var translate = {"nbsp": " ","amp" : "&","quot": "\"","lt"  : "<","gt"  : ">"};
	return ( str.replace(translate_re, function(match, entity) {
	  return translate[entity];
	}) );
}