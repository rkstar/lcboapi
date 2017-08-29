const LCBO = {
  apiKey: 'MDo2MTYzZTA5ZS04ODJjLTExZTctOWEyZS1mZmI2YTM1NTJkYjg6YVRabmEzdjhIYTA5STJHU3FuNXVCSnl1ZXo5dXpYeFRhTm9s',
  url: 'http://lcboapi.com',
  endpoints: {
    buildQueryString: function(params){
      // "params" is an object which will contain key-value pairs that
      // we will need to translate into a querystring to pass to the api
      const properties = Object.keys(params);
      const queryString = properties.reduce(function(accumulator, prop){
        const keyValue = prop + '=' + encodeURIComponent(params[prop]);
        accumulator += '&' + keyValue;
        return accumulator;
      }, '');//'access_key='+LCBO_API_KEY);

      return queryString;
    },
    products: function(params){
      return LCBO.url + '/products?' + this.buildQueryString(params);
    },
    stores: function(params){
      return LCBO.url + '/stores?' + this.buildQueryString(params);
    },
    inventories: function(params){
      return LCBO.url + '/inventories?' + this.buildQueryString(params);
    },
    datasets: function(params){
      return LCBO.url + '/datasets?' + this.buildQueryString(params);
    },
  },

  waitingInterval: null,
  placeStores: function(stores){
    if (!Maps.ready) {
      console.log('map not ready...');
      this.waitingInterval = this.waitingInterval || setInterval(function(){
        LCBO.placeStores(stores);
      }, 1000);
      return;
    }

    clearInterval(this.waitingInterval);

    stores.forEach(function(store){
      Maps.getCoords(store.address_line_1 + ', ' + store.city, function(result, status){
        if (status === 'OK'){
          // add the marker to the page
          const marker = new google.maps.Marker({
            position: result[0].geometry.location,
            map: Maps.map,
          });
          // be able to select the store if we click the marker....
          marker.addListener('click', function(){
            LCBO.chooseStore(store);
          });
        }
      });
    });
  },

  selectedStore: null,
  chooseStore: function(store){
    this.selectedStore = store;
    console.log('selected store:', store);
  },

  searchForProducts: function(query){
    const params = {
      q: query,
      // store_id: this.selectedStore.id,
      order: 'price_in_cents.desc',
    };

    if (this.selectedStore) {
      params.store_id = this.selectedStore.id
    }

    $.ajax({
      beforeSend: function(jqXhr){
        jqXhr.setRequestHeader("Authorization", "Token "+LCBO.apiKey);
      },
      url: LCBO.endpoints.products(params),
      method: 'get',
    }).then(function(data){

      const $productsContainer = $("#products");
      const products = data.result;
      const template = String($("#product_template").html());

      products.forEach(function(product){
        let html = template
          .replace(/{{productName}}/g, product.name)
          .replace(/{{productImage}}/g, product.image_thumb_url)
          .replace(/{{productDescription}}/g, product.description || product.tags)
          .replace(/{{productPrice}}/g, parseFloat(product.price_in_cents / 100).toFixed(2));
        $productsContainer.append( $(html) );
      });

      $productsContainer.removeClass('hidden');
    });
  },
};
