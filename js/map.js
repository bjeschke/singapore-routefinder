	
	function initMap(){
		// save the this variable
		var self = this;
		
		//load the direction services
		this.directionsService = new google.maps.DirectionsService;    	
  	this.directionsDisplay = new google.maps.DirectionsRenderer({
    	polylineOptions: {
     		strokeColor: '#426289',
    		strokeOpacity: 0.8,
    		strokeWeight: 5,
    	}
  	});

		// load the map of Singapore
		this.map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 1.352083, lng: 103.819836},
    	zoom: 12,
    	scrollwheel: false,
    	zoomControl: false,
    	mapTypeControl: false,
    	streetViewControl: false,
  	});
  				
  	this.directionsDisplay.setMap(this.map);
  	this.mapHeight = $('#map').css('height');
  	  	
  	// load the marker
  	this.markerStart = new google.maps.Marker({map: this.map,anchorPoint: new google.maps.Point(0, -29),label: "Sart"});
  	this.markerEnd = new google.maps.Marker({map: this.map,anchorPoint: new google.maps.Point(0, -29),label: "End"});
  	
  	// get the input fields
		this.input_pickup = (document.getElementById('pickupinfo'));
  	this.input_deleivery = (document.getElementById('deliveryinfo'));
  	
  	// get the zoom buttons
  	this.zoomInButton = (document.getElementById('zoomin'));
  	this.zoomOutButton = (document.getElementById('zoomout'));
  	
  	
  	
  	/* -------
  	* Events
  	*--------*/
  	
		// add the change Listener
	 	google.maps.event.addDomListener(window, 'load', function(){self.initialize(self.input_pickup)});
	 	google.maps.event.addDomListener(window, 'load', function(){self.initialize(self.input_deleivery)});
	 	
	 	// add Listener to the zoom buttons
	 	google.maps.event.addDomListener(zoomInButton, 'click', function() {self.map.setZoom(self.map.getZoom() + 1);});
  	google.maps.event.addDomListener(zoomOutButton, 'click', function() {self.map.setZoom(self.map.getZoom() - 1);});  
	 	
	 	// calculate route when click on submit
	 	$('.form .submit').click(function(){	 	
    	self.calculateAndDisplayRoute(self.directionsService, self.directionsDisplay);
	 	});
	 	
	 	// Events for expand the map
	 	$('#expandmap').click(function(){
	 		if($('#mapwrapper').hasClass('expanded')){ 	
	 			$('#header').show();
				$('#map').css('height',self.mapHeight);	
				$('#'+this.id + ' .text').html('Expand map');
	 		}
	 		else {
	 			$('#header').hide();
	 			var height = $('#header').height();
				$('#map').css('height',(window.screen.height - (height+50)) + 'px');
				$('#'+this.id + ' .text').html('Collapse map');
	 		}
	 		$('#mapwrapper').toggleClass('expanded');
	 		google.maps.event.trigger(self.map, "resize");	 		
		});
		
		
		
	 /* -------
  	* Functions
  	*--------*/
	 	
	 	// calculate the route
	 	this.calculateAndDisplayRoute = function(directionsService, directionsDisplay) 
	 	{
	 		self.latPickup = $('#pickupinfo_lat').val();
  		self.lngPickup = $('#pickupinfo_lng').val();
  		
  		self.latDelivery = $('#deliveryinfo_lat').val();
  		self.lngDelivery = $('#deliveryinfo_lng').val();
  		
    	var LatlngPickup = new google.maps.LatLng(self.latPickup,self.lngPickup);
    	var LatlngDelivery = new google.maps.LatLng(self.latDelivery,self.lngDelivery);

  		directionsService.route({
    		origin: LatlngPickup,
    		destination: LatlngDelivery,
    		travelMode: google.maps.TravelMode.DRIVING
  			}, function(response, status) {
    			if (status === google.maps.DirectionsStatus.OK) {
      			directionsDisplay.setDirections(response);
      			self.computeTotalDistance(directionsDisplay.getDirections());
    			} else {
    				self.showError();
    			}
    	});
  	}

		// calculate and show the distance
	 	this.computeTotalDistance = function(result) {
  		var total = 0;
  		var myroute = result.routes[0];
  		
  		for (var i = 0; i < myroute.legs.length; i++) {
    		total += myroute.legs[i].distance.value;
  		}
  		total = (total / 1000).toFixed(2);
  		$('#totaldistance').html(total + ' km');
  		$('.mapinformation .mapinformationinside').show(1000);
		}
		
		this.showError = function(){
			$('.maperrorcontainer').show();	
			$('.maperror button').click(function(){$('.maperrorcontainer').hide();})
		};

	 	// initialize the autocomplete
	 	this.initialize = function(input)
    {
    	var autocomplete = new google.maps.places.Autocomplete(
      	(input),
      	{
        	componentRestrictions: {country: 'sg'},
        });
        
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
      	var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
            
        var id = $(input).attr('id');           
        document.getElementById(id +'_lat').value = place.geometry.location.lat();
        document.getElementById(id +'_lng').value = place.geometry.location.lng();
      });
    }	 	
	}