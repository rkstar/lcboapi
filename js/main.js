
$(function(){
  $.ajax({
    beforeSend: function(jqXhr){
      jqXhr.setRequestHeader("Authorization", "Token "+LCBO.apiKey);
    },
    url: LCBO.endpoints.stores({
      geo: RED.postalCode,
    }),
    method: 'get',
  }).then(function(data){
    LCBO.placeStores(data.result);
  });
});
