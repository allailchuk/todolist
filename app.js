// Making request to the server 
function GET(url, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        callback(JSON.parse(this.responseText));
	    }
	};
	xmlhttp.open('GET', url, true);
	xmlhttp.send();
}

function POST(url, data, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 201) {
	        callback(JSON.parse(this.responseText));
	    }
	};
	xmlhttp.open("POST", url);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(data));
}

function PUT(url, data, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        callback(JSON.parse(this.responseText));
	    }
	};
	xmlhttp.open("PUT", url);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(data));
}

function DELETE(url, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        callback();
	    }
	};
	xmlhttp.open("DELETE", url);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
}

GET('/restapi/todos', function(rsp) {
	for (var i = 0; i < rsp.data.length; i++ ) {
		addElement(rsp.data[i].id, rsp.data[i].name, rsp.data[i].status);	
	}		
})

function addElement(id, name, status) {
	// creating new element
	var li = document.createElement("li");
	if (status == "1") {
		li.className = "checked";
	}
	li.setAttribute("data-id", id);
	var text = document.createTextNode(name);
	li.appendChild(text);
	document.getElementById("list").appendChild(li);

	//mark list item completed
	li.addEventListener('click', function (e) {
		e.stopPropagation();

		var li = this;
		PUT('/restapi/todos/' + id, {status: status == "0" ? 1 : 0}, function(rsp){
			status = rsp.status;
			if (rsp.status == "1") {
				li.className = "checked";
			} else {
				li.className = "";
			}
		})	
	})

	// adding "X" - Delete button to each list item			
	var span = document.createElement("span");
	var text = document.createTextNode("\u00D7");
	span.className = "closeButton";
	span.appendChild(text);
	li.appendChild(span);
	span.onclick = deleteElement;
}

// deleting list item by clicking on "X" button
function deleteElement(e) {
	e.stopPropagation();
	var li = this.parentElement;
	var id = li.getAttribute("data-id");
	DELETE('/restapi/todos/' + id, function(){
		li.parentElement.removeChild(li);
	})		
}
//creating new list item
function add() {
	var inputValue = document.getElementById("inputBox").value;
	if (inputValue == "") {
		alert ("Write something");
	} else {
		POST('/restapi/todos', {'name':inputValue}, function(addedItem){
			addElement(addedItem.id, addedItem.name, addedItem.status);	
			document.getElementById("inputBox").value = "";
		})
		
	}
}

document.getElementById('inputBox').addEventListener("keypress", keyboardPress);
function keyboardPress (enter) {
	if (enter.keyCode == 13) {
		add();
	}
}




	

	
	


































