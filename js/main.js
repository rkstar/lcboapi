
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

  // add an event listener to the search field...
  const ENTER_KEY = 13;
  const TAB_KEY = 9;
  $("#search").on('keydown', function(e){
    $products = $("#products");
    if (!$products.hasClass('hidden')) {
      console.log('SHEEEEIIIIITTT.... we are showing our products son...');
      $products
        .addClass('hidden')
        .empty();
    }

    const keyCode = e.which || e.keyCode;
    if ((keyCode === ENTER_KEY) || (keyCode === TAB_KEY) ) {
      e.preventDefault();
      const query = $(this).val();
      LCBO.searchForProducts(query);
    }
  });
});
