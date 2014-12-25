function arrayRemove(item, array) {
    return jQuery.grep(array, function(value) {
        return value != item;
    });
}

var ArrayObject = function (inputData) {

	var self = this,
		keys = {
			ID: "id"
		},
		order = {
			ASC: "asc",
			DESC: "desc"
		},
		DELIMITER = "\|-|-|/";

	self.ids = [];
	self.orderBy = null;
	self.orderWay = null;
	self.itemsCount = 0;
	self.data = {};
	self.keys = [];
	self.loop = [];

	self.fill = function (data) {
		self.clear();

		if(!$.isEmptyObject(data)) {
			$.each(data, function (id, itemData) {

				id = parseInt(id);

				if(!self.itemExists(id)) {
					self.addItem(id, itemData);
				}
			});

			self.createKeysArray(self.getItem(self.ids[0]));

			self.orderAsc();
		}
	};

	self.keyExists = function (key) {
		return $.inArray(key, self.keys) !== -1;
	};

	self.createKeysArray = function (obj) {

		$.each(obj, function (key, v) {
			if(!self.keyExists(key)) {
				self.keys.push(key);
			}
		});
	};

	self.orderAsc = function () {
		self.orderWay = order.ASC;
		self.refreshOrder();
	};

	self.orderDesc = function () {
		self.orderWay = order.DESC;
		self.refreshOrder();
	};

	self.orderByKey = function (key, orderWay) {
		var tempAray = [],
			orderWay = orderWay === order.DESC ? order.DESC : order.ASC;

		$.each(self.getData(), function (k, v) {
			tempAray.push([v[key], k].join(DELIMITER));
		});

		tempAray.sort();

		if(orderWay === order.DESC) {
			tempAray.reverse();
		}

		if(tempAray.length) {
			self.ids = [];
			$.each(tempAray, function (k, v) {
				v = v.split(DELIMITER);
				v = parseInt(v[1]);
				self.ids.push(v);
			})
		}
	};

	self.refreshOrder = function () {
		var orderBy = $.inArray(self.orderBy, self.keys) !== -1 ? self.orderBy : keys.ID,
			orderWay = self.orderWay === order.ASC ? order.ASC : order.DESC;

		if(orderBy === keys.ID) {
			if(orderWay === order.ASC) {
				self.ids.sort(function(a, b){return a-b});
			} else {
				self.ids.sort(function(a, b){return b-a});
			}
		} else {
			self.orderByKey(self.orderBy, self.orderWay);
		}
	};

	self.refreshCount = function () {
		self.itemsCount = self.ids.length;
	};

	self.getData = function () {
		return self.data;
	};


	self.init = function () {

		if(inputData) {
			self.fill(inputData);
		}
	};

	self.clear = function () {
		self.ids = [];
		self.orderBy = null;
		self.orderWay = null;
		self.itemsCount = 0;
		self.data = {};
		self.keys = [];
		self.resetLoop();
	};

	self.count = function () {
		return self.itemsCount;
	};

	self.isEmpty = function () {
		return self.count() < 1;
	};

	self.getAllIds = function () {
		return self.ids;
	};

	self.itemExists = function (item_id) {
		if(self.isEmpty()) {
			return false;
		}
		return $.inArray(item_id, self.ids) !== -1;
	}

	self.getItem = function (item_id) {
		return self.getItemWhere(keys.ID, item_id);
	}

	self.addItem = function (item_id, item_data, refresh_order) {

		refresh_order = refresh_order === true;

		if(self.itemExists(item_id)) {
			return true;
		}
		self.ids.push(item_id);
		self.data[item_id] = item_data;	

		self.refreshCount();

		if(refresh_order) {
			self.refreshOrder();
		}

		return true;
	};

	self.getItemWhere = function (key, value) {

		if(self.isEmpty()) {
			return null;
		}

		key = key ? key : keys.ID;

		if(key === keys.ID) {
			if(!self.itemExists(value)) {
				return null;
			}
			return self.data[value];
		}

		var item_to_return = null;
		$.each(self.data, function (item_id, item_data) {
			if(item_data[key] && item_data[key] == value) {
				item_to_return = item_data;
				return false;
			}
		});
		return item_to_return;
	};

	self.createLoop = function () {
		self.loop = self.ids.slice(); // a new array has to eb created with slice
	};

	self.resetLoop = function () {
		self.loop = [];
	};

	self.isLooped = function () {
		return self.loop.length > 0;
	};

	self.getLoopedItem = function () {
		if(!self.isLooped()) {
			return null;
		}

		var id = self.loop.shift();

		return self.getItem(id);
	};


	self.init();

	return self;

};