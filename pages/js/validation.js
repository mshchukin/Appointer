//--------------------- MODIFIED BY MITCHELL ---------------------//
/* This function is used on the log in page validates users input on 
   the click of the submit button. It also sends the data, and recieves 
   back if the user is allowed to enter the site or not. In the latter 
   case an error is shown to the user */
   
function logIn(event) //Log the user in
{
    event.preventDefault(); //Stop the form from submitting

    var test = true;

    var email = document.getElementById("loginemail").value;
    var password = document.getElementById("loginpassword").value;

    var emailpat = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/;

    //Set all labels to black
    document.getElementById("label-loginemail").style.color = "#000";
    document.getElementById("label-loginpassword").style.color = "#000";

    //Email
    if (email == "" || email.length == 0 || !email.match(emailpat) || email.length > 256) //Invalid
    {
        document.getElementById("label-loginemail").style.color = "red";
        test = false;
    }

    //Password
    if (password == "" || password.length == 0) //Invalid
    {
        document.getElementById("label-loginpassword").style.color = "red";
        test = false;
    }

    if (test) //Valid
    {
        //Log the user in
        $.post("/login", $("form#login").serialize(),
            function(data)
            {
                if (data.success) //The user was logged in
                {
                    //Reset the text and send the user to their home view
                    document.getElementById("loginText").innerHTML = "Enter your email and password <strong>to log in</strong>";
                    document.getElementById("loginText").style.color = "";
                    window.location.replace("/home");
                }
                else //The user was not logged in
                {
                    //Show the error
                    document.getElementById("loginText").innerHTML = data.error;
                    document.getElementById("loginText").style.color = "red";
                }
            },
            "json"
        );
    }
}

/* This function is used for the signup page validates users input on 
   the click of the submit button. It also sends the data, and recieves 
   back if the user is allowed to sign up with the information provided 
   or not. In the latter case an error is shown to the user */
function createAccount(event) //Create a new account
{
    event.preventDefault(); //Stop the form from submitting

    var test = true;
    //obtain all values from the form
    var first = document.getElementById("firstName").value;
    var last = document.getElementById("lastName").value;
    var month = document.getElementById("months").value;
    var day = document.getElementById("days").value;
    var year = document.getElementById("years").value;
    var email = document.getElementById("email").value;
    var country = document.getElementById("country").value;
    var province = document.getElementById("province").value;
    var city = document.getElementById("city").value;
    var password = document.getElementById("password").value;
    var password2 = document.getElementById("passwordRepeat").value;

    var score = scorePassword(password);
    var emailpat = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/;
    var daypat = /([1-9]|[12]\d|3[01])/;
    var monthpat = /^(0?[1-9]|1[012])$/;
    var yearpat = /^\d{4}$/;
    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //Set all labels to black
    document.getElementById("label-firstName").style.color = "#000";
    document.getElementById("label-lastName").style.color = "#000";
    document.getElementById("label-birthdate").style.color = "#000";
    document.getElementById("label-email").style.color = "#000";
    document.getElementById("label-location").style.color = "#000";
    document.getElementById("label-password").style.color = "#000";
    document.getElementById("label-passwordConfirm").style.color = "#000";

    //First Name
    if (first == "" || first.length == 0 || first.length < 2 || first.length > 50) //Invalid
    {
        document.getElementById("label-firstName").style.color = "red";
        test = false;
    }

    //Last Name
    if (last == "" || last.length == 0 || last.length < 2 || last.length > 50) //Invalid
    {
        document.getElementById("label-lastName").style.color = "red";
        test = false;
    }

    //Birthdate
    if (month == "0" || day == "0" || year == "0" || year > 1998) //Invalid
    {
        document.getElementById("label-birthdate").style.color = "red";
        test = false;
    }
    else //Possibly valid
    {
        if (month.match(monthpat) && day.match(daypat) && year.match(yearpat)) //Matches pattern
        {
            if ((month == 1 || month > 2) && day > ListofDays[month - 1]) //Invalid
            {
                document.getElementById("label-birthdate").style.color = "red";
                test = false;
            }

            if (month == 2) //February
            {
                var lyear = false;

                if ((!(year % 4) && year % 100) || !(year % 400)) //Check if the selected year is a leap year
                {
                    lyear = true;
                }

                if ((lyear == false && day >= 29) || (lyear == true && day > 29)) //Invalid
                {
                    document.getElementById("label-birthdate").style.color = "red";
                    test = false;
                }
            }
        }
        else //Invalid
        {
            document.getElementById("label-birthdate").style.color = "red";
            test = false;
        }
    }

    //Email
    if (email == "" || email.length < 6 || email.length > 256 || !email.match(emailpat)) //Invalid
    {
        document.getElementById("label-email").style.color = "red";
        test = false;
    }

    //Country
    if (country == "00" || country == "") //Invalid
    {
        document.getElementById("label-location").style.color = "red";
        test = false;
    }

    //Province
    if (province == "00" || province == "") //Invalid
    {
        document.getElementById("label-location").style.color = "red";
        test = false;
    }

    //City
    if (city == "00" || city == "" || city.length == 0) //Invalid
    {
        document.getElementById("label-location").style.color = "red";
        test = false;
    }

    //Passwords
    if (password == "" || password.length == 0 || password.length >= 96 || score < 60) //Invalid or too weak
    {
        document.getElementById("label-password").style.color = "red";
        test = false;
    }

    if (password2 == "" || password2.length == 0) //Invalid
    {
        document.getElementById("label-passwordConfirm").style.color = "red";
        test = false;
    }

    if (password !== password2) //Not equal
    {
        document.getElementById("label-password").style.color = "red";
        document.getElementById("label-passwordConfirm").style.color = "red";
        test = false;
    }

    if (test) //Valid
    {
        //Create the user's account
        $.post("/register", $("form#register").serialize(),
            function(data)
            {
                if (data.success) //The user's account was created
                {
                    //Reset the text and send the user to their home view
                    document.getElementById("registerText").innerHTML = "Enter your personal details <strong>to create an acount</strong>";
                    document.getElementById("registerText").style.color = "";
                    window.location.replace("/home");
                }
                else
                {
                    //Show the error
                    document.getElementById("registerText").innerHTML = data.error;
                    document.getElementById("registerText").style.color = "red";
                }
            },
            "json"
        );
    }
}
/*This function is used both for signup and adding a stylist.
  As the user types and clicks off of the input field this
  function is called to check if the name is valid*/
function validateFirstName(event) //Validate the first name
{
    var form = event.currentTarget.id;
    var label = "label-" + form;
    var first = event.currentTarget.value;

    //Set the label back to black
    document.getElementById(label).style.color = "#000";

    if (first == "" || first.length < 2 || first.length > 50) //Invalid
    {
        document.getElementById(label).style.color = "red";
    }
}

/*This function is used both for signup and adding a stylist.
  As the user types and clicks off of the input field this
  function is called to check if the name is valid*/
function validateLastName(event) //Validate the last name
{
    var form = event.currentTarget.id;
    var label = "label-" + form;
    var last = event.currentTarget.value;

    //Set the label back to black
    document.getElementById(label).style.color = "#000";

    if (last == "" || last.length < 2 || last.length > 50) //Invalid
    {
        document.getElementById(label).style.color = "red";
    }
}
/*This function is used both for signup and adding a stylist.
  As the user clicks on and clicks off of the input field this
  function is called to check if the birthdate is valid*/
function validateDate() //Validate the date
{
    var month = document.getElementById("months").value;
    var day = document.getElementById("days").value;
    var year = document.getElementById("years").value;

    //Set the label back to black
    document.getElementById("label-birthdate").style.color = "#000";

    if (month == "00" || day == "00" || year == "00" || month == "" || day == "" || year == "" || month.length == 0 || day.length == 0 || year.length == 0 || year > 1998) //Invalid
    {
        document.getElementById("label-birthdate").style.color = "red";
    }
}
/*This function is used both for signup and adding a stylist.
  As the user types and clicks off of the input field this
  function is called to check if the email is valid*/
function validateEmail(event) //Validate the email
{
    var form = event.currentTarget.id;
    var label = "label-" + form;
    var email = event.currentTarget.value;
    var emailpat = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/;

    //Set the label back to black
    document.getElementById(label).style.color = "#000";

    if (email == "" || email.length == 0 || email.length > 256 || !email.match(emailpat)) //Invalid
    {
        document.getElementById(label).style.color = "red";
    }
}
/*This function is used both for signup,adding a stylist,
  manager settings, and customer settings.As the user clicks on 
  and clicks off of the input field this function is called 
  to check if the location is valid*/
function validateLocation() //Validate the location
{
    var country = document.getElementById("country").value;
    var province = document.getElementById("province").value;
    var city = document.getElementById("city").value;

    //Set the label back to black
    document.getElementById("label-location").style.color = "#000";

    if (country == "00" || province == "00" || city == "00" || country == "" || province == "" || city == "" || country.length == 0 || province.length == 0 || city.length == 0 ) //Invalid
    {
        document.getElementById("label-location").style.color = "red";
    }
}
/*This function is used both for signup,adding a stylist,
  manager settings, and customer settings.As the user clicks 
  off of the province field this function is called 
  to provide a list of cities availabe in that province*/
function populateCities(event) //Populate the city list
{
    var province = event.currentTarget.value;
    var selection = document.getElementById("city");
    var i;
    var city_stateArr;
    var city_states = Object();

    //Add the available cities
    city_states["Alberta"] = "|Calgary|Edmonton|Medicine Hat";
    city_states["British Columbia"] = "|Abbotsford|Burnaby|Coquitlam|Kelowna|Langley|North Vancouver |Richmond|Surrey|Vancouver";
    city_states["Manitoba"] = "|Brandon|Steinbach|Thompson|Winnipeg";
    city_states["New Brunswick"] = "|Dieppe|Fredericton|Moncton|Saint John";
    city_states["Newfoundland/Labrador"] = "|Corner Brook|Conception Bay South|Mount Pearl|Paradise|St.John's";
    city_states["Nova Scotia"] = "|Amherst|Cape Breton|Halifax|Turo";
    city_states["Northwest Territories"] = "|Inuvik|Yellowknife";
    city_states["Nunavut"] = "|Iqaluit";
    city_states["Ontario"] = "|Brampton|Hamilton|London|Mississauga|Ottawa|Toronto";
    city_states["Prince Edward Island"] = "|Charlottetown|Summerside";
    city_states["Quebec"] = "|Gatineua|Laval|Longueuil|Quebec|Montreal";
    city_states["Saskatchewan"] = "|Moose Jaw|Regina|Saskatoon";
    city_states["Yukon"] = "|Whitehorse";

    if (province != "00" && province != "" && province.length != 0) //Valid
    {
        for (i = selection.options.length - 1; i >= 0; i--) //Empty the city list
        {
            selection.remove(i);
        }

        selection.options[selection.options.length] = new Option("City", "00");
        city_stateArr = city_states[province].split("|");

        for (var i = 1; i <= city_stateArr.length; i++) //Fill the city list
        {
            if (city_stateArr[i] !== "" || city_stateArr[i].length != 00)
            {
                selection.options[i] = new Option(city_stateArr[i], city_stateArr[i]);
            }
        }
    }
}
/*This function is used both for signup, manager settings, 
  employee settings, and customer settings. As the user types 
  and clicks off of the input field this function is called 
  to check if the email is valid*/
function validatePassword(event) //Validate the password
{
    var form = event.currentTarget.id;
    var label = "label-" + form;
    var password = event.currentTarget;

    //Set the label back to black
    document.getElementById(label).style.color = "#000";

    if (password.value == "" || password.value.length == 0) //Invalid
    {
        document.getElementById(label).style.color = "red";
    }
}

//User Views
/*This function is used on the customer view page to populate
  the list of stylists when the customer selects their desired
  branch location. */
function populateStylists()
{
    var id = -1; //Stores the ID of the selected location
    var popupWindow = document.getElementById("selectStylistGrid");

    for (i = 0; i < locations.length && id == -1; i++) //Loop through the locations and find the selected location's ID
    {
        if (locations[i].address == document.getElementById("selectLocation").value)
        {
            id = locations[i].id;
        }
    }

    popupWindow.innerHTML = ""; //Empty the existing stylists

    //Set up the data to send
    var loc =
        {
            location: id
        };

    if (id > -1) //The selected location is valid
    {
        //Get the stylists for the specified location
        $.post("/salon/stylists", loc,
            function(data)
            {
                stylists = data; //Update the stylists array

                for (i = 0; i < data.length; i++)
                {
                    var stylistAvatarSRC = "/uploads/" + data[i].image;

                    var newLi = document.createElement("li");

                    var newDiv = document.createElement("div");
                    newDiv.className = "employeeInfo";
                    newDiv.id = data[i].firstName;

                    //Stylist image
                    var newImg = document.createElement("img");
                    newImg.id = "employeeProfilePic";
                    newImg.className = "employeeProfile";
                    newImg.src = stylistAvatarSRC; //CHANGE
                    newImg.alt = "Stylist Image";

                    //Stylist name
                    var newP = document.createElement("p");
                    newP.id = "employeeName";
                    newP.className = "employeeName";

                    var newPText = document.createTextNode(data[i].firstName);
                    newP.appendChild(newPText);

                    //Insert the image and name into the div
                    newDiv.appendChild(newImg);
                    newDiv.appendChild(newP);

                    //Insert the div into li and into the popup
                    newLi.appendChild(newDiv);
                    popupWindow.appendChild(newLi);
                }

                stylistListeners(); //Add listeners to the new stylists
            },
            "json"
        );
    }
}

/*This function is used on the customer view page to populate
  the list of services that the customer may choose from. */
function populateServices(event)
{
    var list = document.getElementById("selectHairstyle");

    //Get the services
    $.post("/salon/services",
        function(data)
        {
            services = data; //Update the service array

            for (i = 0; i < data.length; i++) //Loop through the services and add each one to the list
            {
                var opt = document.createElement("option");

                opt.value = data[i].service;
                opt.innerHTML = data[i].service;
                list.appendChild(opt);
            }
        },
        "json"
    );
}

/*This function is used on the customer view page to populate
  the list of branch locations that the customer may choose from. */
function populateLocations(event)
{
    var list = document.getElementById("selectLocation");

    //Get the locations
    $.post("/salon/locations", function(data)
        {
            locations = data; //Update the location array

            for (i = 0; i < data.length; i++) //Loop through the locations and add each one to the list
            {
                var opt = document.createElement("option");

                opt.value = data[i].address;
                opt.innerHTML = data[i].address;
                list.appendChild(opt);
            }
        },
        "json"
    );
}

function updateCustomerCalendar(event) //Update the customer calendar
{
    var test = true;
    var hairstyle = document.getElementById("selectHairstyle");
    var location = document.getElementById("selectLocation");
    var stylist = document.getElementById("selectedHairstylist");
    var request = document.getElementById("specialRequest").value;
    var file = document.getElementById("appointmentPic");

    //Reset the selections
    selectedService = -1;
    selectedLocation = -1;
    selectedStylist = -1;

    //Set all labels to grey
    document.getElementById("label-selectHairstyle").style.color = "";
    document.getElementById("label-selectLocation").style.color = "";
    document.getElementById("label-selectStylist").style.color = "";
    document.getElementById("label-specialRequest").style.color = "";
    document.getElementById("label-appointmentUpload").style.color = "";

    //Determine which service was selected
    for (i = 0; i < services.length && selectedService == -1; i++)
    {
        if (services[i].service == hairstyle.value)
        {
            selectedService = i;
        }
    }

    //Determine which location was selected
    for (i = 0; i < locations.length && selectedLocation == -1; i++)
    {
        if (locations[i].address == location.value)
        {
            selectedLocation = i;
        }
    }

    //Determine which stylist was selected
    if (stylists != null)
    {
        for (i = 0; i < stylists.length && selectedStylist == -1; i++)
        {
            if (stylists[i].firstName == stylist.innerHTML)
            {
                selectedStylist = i;
            }
        }
    }

    if (hairstyle.value == "Please Select" || selectedService == -1) //Invalid
    {
        document.getElementById("label-selectHairstyle").style.color = "red";
        test = false;
    }

    if (location.value == "Please Select" || !selectedLocation == -1) //Invalid
    {
        document.getElementById("label-selectLocation").style.color = "red";
        test = false;
    }

    if (stylist.innerHTML == "(Please select)" || !selectedStylist == -1) //Invalid
    {
        document.getElementById("label-selectStylist").style.color = "red";
        test = false;
    }

    if (request.length > 256) //Invalid
    {
        document.getElementById("label-specialRequest").style.color = "red";
        test = false;
    }

    if (file.files.length == 0) //No file
    {
        fileUploaded = false;
    }
    else //File
    {
        var extensions = new Array("jpg", "jpeg", "png");
        var validExtension = false;
        var extension = file.files[0].name.split(".").pop().toLowerCase();

        fileUploaded = true;

        for (var i = 0; i < extensions.length && !validExtension; i++) //Validate the file extension
        {
            if (extensions[i] == extension)
            {
                validExtension = true;
            }
        }

        if (file.files[0].size > 1000000 || !validExtension) //Invalid
        {
            document.getElementById("label-appointmentUpload").style.color = "red";
            fileUploaded = false
            test = false;
        }
    }

    if (test) //Valid
    {
        //New event source
        var source =
            {
                url: "/salon/unavailable",
                data:
                {
                    location: locations[selectedLocation].id,
                    stylist: stylists[selectedStylist].id
                }
            };

        $("#calendar").fullCalendar("changeView", "month"); //Change the calendar to the month view
        $("#calendar").fullCalendar("removeEventSources"); //Remove all old event sources
        $("#calendar").fullCalendar("addEventSource", source); //Add the new event source

        enabled = true; //Enable the calendar

        swal("Calendar Updated!", "You can now choose a date and\ntime for your appointment!", "success"); //Alert the user that the calendar is enabled
    }
    else //Invalid
    {
        swal("Whoops!", "Please double check your\nappointment details!", "warning"); //Alert the user to fix their details
    }

}

function updateStylistCalendar(event) //Update the stylist calendar
{
    var test = true;
    var hairstyle = document.getElementById("selectHairstyle");
    var request = document.getElementById("specialRequest").value;

    selectedService = -1; //Reset the selected service

    //Set all labels to grey
    document.getElementById("label-selectHairstyle").style.color = "";
    document.getElementById("label-specialRequest").style.color = "";

    //Determine which service was selected
    for (i = 0; i < services.length && selectedService == -1; i++)
    {
        if (services[i].service == hairstyle.value)
        {
            selectedService = i;
        }
    }

    if (hairstyle.value == "Please Select" || selectedService == -1) //Invalid
    {
        document.getElementById("label-selectHairstyle").style.color = "red";
        test = false;
    }

    if (request.length > 256) //Invalid
    {
        document.getElementById("label-specialRequest").style.color = "red";
        test = false;
    }

    if (test) //Valid
    {
        $("#calendar").fullCalendar("refetchEvents");
        enabled = true;

        swal("Calendar Updated!", "You can now choose a date and\ntime for your appointment.", "success");
    }
    else
    {
        swal("Whoops!", "Please finish filling in your\nappointment details.", "warning");
    }
}

/*This function is used on the customer view page to verify
  that the customer actually selected a service/hairstyle. */
function verifyHairstyle(event) 
{
    var hairstyle = document.getElementById("selectHairstyle");

    enabled = false; //Disable the calendar

    //Set the label to grey
    document.getElementById("label-selectHairstyle").style.color = "";

    if (hairstyle.value == "Please Select") //Invalid
    {
        document.getElementById("label-selectHairstyle").style.color = "red";
    }
}

/*This function is used on the customer view page to verify
  that the customer actually selected a branch location. */
function verifyLocation(event)
{
    var location = document.getElementById("selectLocation");

    enabled = false; //Disable the calendar

    //Set the label to grey
    document.getElementById("label-selectLocation").style.color = "";

    if (location.value == "Please Select")
    {
        document.getElementById("label-selectLocation").style.color = "red";
    }
    else
    {
        populateStylists(); //Populate the stylist list
    }
}

/*This function is used on the customer view page to verify
  that the customer actually selected a stylist. */
function verifyStylist(event)
{
    var stylist = document.getElementById("selectedHairstylist");

    enabled = false; //Disable the calendar

    //Set the label to grey
    document.getElementById("label-selectStylist").style.color = "";

    if (stylist.innerHTML == "(Please select)")
    {
        document.getElementById("label-selectStylist").style.color = "red";
    }
}

/*This function is used on the customer view page to verify
  that the customer's entered details are within the specific
  character count (range is from 0 to 255 characters). */
function verifyDetails(event)
{
    var request = event.currentTarget.value;

    //Set the label back to grey
    document.getElementById("label-specialRequest").style.color = "";

    if (request.length > 256) //Invalid
    {
        document.getElementById("label-specialRequest").style.color = "red";
    }
}

function closeEvent(event) //Close the event popup
{
    var modal = document.getElementById("eventPopup");

    //Reset the selected event and close the event popup
    selectedEvent = -1;
    modal.style.display = "none";
}

function closeEventMeeting(event) //Close the meeting event popup
{
    var modal = document.getElementById("eventPopupMeeting");

    //Reset the selected event and close the meeting event popup
    selectedEvent = -1;
    modal.style.display = "none";
}

function cancelEvent(event) //Cancel an appointment event
{
    if (selectedEvent > -1)
    {
        //Set up the data to send
        var cancel =
            {
                appointment: selectedEvent
            };

        //Cancel the appointment
        $.post("/salon/cancel", cancel,
            function(data)
            {
                if (data.success) //The appointment was cancelled
                {
                    swal("Appointment Cancelled!", "You appointment has been cancelled!", "success"); //Alert the user
                }
                else //The appointment was not cancelled
                {
                    swal("Appointment Not Cancelled!", "You appointment could not be cancelled!", "error"); //Alert the user
                }

                $("#calendar").fullCalendar("refetchEvents"); //Refetch the calendar events
            },
            "json"
        );
    }

    closeEvent(event); //Close the cancelled event
}

function cancelMeeting(event) //Cancel a meeting event
{
    if (selectedEvent > -1)
    {
        //Set up the data to send
        var cancel =
            {
                appointment: selectedEvent
            };

        //Cancel the meeting
        $.post("/salon/cancel", cancel,
            function(data)
            {
                if (data.success) //The meeting was cancelled
                {
                    swal("Meeting Cancelled!", "Your meeting has been cancelled!", "success"); //Alert the user
                }
                else //The meeting was not cancelled
                {
                    swal("Meeting Not Cancelled!", "Your meeting could not be cancelled!", "error"); //Alert the user
                }

                $("#calendar").fullCalendar("refetchEvents"); //Refetch the calendar events
            },
            "json"
        );
    }

    closeEventMeeting(event); //Close the cancelled event
}

//--------------------- EVERYTHING BEYOND THIS POINT IS UNTOUCHED ---------------------//
/* This function is used on the add stylist page and validates users input on 
   the click of the submit button. It also sends the data, and recieves 
   back if the user is allowed to create a new stylist or not. In the latter 
   case an error is shown to the user */
function createStylistAccount(event)
{
    var test = true;

    //First Name
    var first = document.getElementById("firstName").value;

    if (first === "" || first.length === 0) //Checks if empty
    {
        document.getElementById("label-firstName").style.color = "red";
        event.preventDefault();
        test = false;
    }
    else if (first.length < 2) //checks if greater then 2 characters
    {
        document.getElementById("label-firstName").style.color = "red";
        document.getElementById("label-firstName").innerHTML = "First Name* At Least 2 characters";
        document.getElementById("label-firstName").style.fontSize = "8px";
        event.preventDefault();
        test = false;
    }
    else if (first.length > 50) //checks if greater then 50 characters
    {
        document.getElementById("label-firstName").style.color = "red";
        document.getElementById("label-firstName").innerHTML = "Can not be greater then 50 characters";
        document.getElementById("label-firstName").style.fontSize = "8px";

        event.preventDefault();
        test = false;
    }
    else //valid
    {
        document.getElementById("label-firstName").innerHTML = "First Name*";
        document.getElementById("label-firstName").style.color = "#000";
        document.getElementById("label-firstName").style.fontSize = "12px";
    }

    //Last Name
    var last = document.getElementById("lastName").value;

    if (last === "" || last.length === 0) //Checks if empty
    {
        document.getElementById("label-lastName").style.color = "red";
        event.preventDefault();
        test = false;
    }
    else if (last.length < 2) //checks if less then 2 characters
    {
        document.getElementById("label-lastName").style.color = "red";
        document.getElementById("label-lastName").innerHTML = "Last Name* At least 2 characters";
        document.getElementById("label-lastName").style.fontSize = "8px";
    }
    else if (last.length > 50) //checks if greater then 50 characters
    {
        document.getElementById("label-lastName").style.color = "red";
        document.getElementById("label-lastName").innerHTML = "Can not be greater then 50 characters";
        document.getElementById("label-lastName").style.fontSize = "8px";
    }
    else //valid
    {
        document.getElementById("label-lastName").innerHTML = "Last Name*";
        document.getElementById("label-lastName").style.color = "#000";
    }

    //Birthdate
    var month = document.getElementById("months").value;
    var day = document.getElementById("days").value;
    var year = document.getElementById("years").value;

    var daypat = /([1-9]|[12]\d|3[01])/;
    var monthpat = /^(0?[1-9]|1[012])$/;
    var yearpat = /^\d{4}$/;
    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === "0" || day === "0" || year === "0" || year > 1998) //checks if empty or too young
    {
        document.getElementById("label-birthdate").style.color = "red";
        event.preventDefault();
        test = false;
    }
    else //possibly valid
    {
        if (month.match(monthpat) && day.match(daypat) && year.match(yearpat))
        {
            //checks to see if each month has a valid day attached
            if (month === 01 || month > 02) 
            {
                if (day > ListofDays[month - 1])
                {
                    document.getElementById("label-birthdate").style.color = "red";
                    document.getElementById("label-birthdate").innerHTML = "Invalid Date";
                    test = false;
                }
            }
            if (month === "02") //also checks here for a leap year
            {
                var lyear = false;
                if ((!(year % 4) && year % 100) || !(year % 400))
                {
                    lyear = true;
                }
                if ((lyear === false) && (day >= 29))
                {
                    document.getElementById("label-birthdate").style.color = "red";
                    document.getElementById("label-birthdate").innerHTML = "Invalid Date";
                    test = false;
                }
                if ((lyear === true) && (day > 29))
                {
                    document.getElementById("label-birthdate").style.color = "red";
                    document.getElementById("label-birthdate").innerHTML = "Invalid Date";
                    test = false;
                }
            }
        }
        else
        {
            document.getElementById("label-birthdate").style.color = "red";
            document.getElementById("label-birthdate").innerHTML = "Enter Date in proper dd/mm/yyyy";
            test = false;
        }
    }

    //Email
    var email = document.getElementById("email").value;
    var emailpat = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/;
    
    //applies old style
    document.getElementById("label-email").innerHTML = "Email*";
    document.getElementById("label-email").style.color = "#000";
    
    if (email === "" || email.length === 0) //checks if empty
    {
        document.getElementById("label-email").style.color = "red";
        event.preventDefault();
        test = false;
    }
    else if (email.length > 256) //if email is too long
    {
        document.getElementById("label-email").style.color = "red";
        document.getElementById("label-email").innerHTML = "Email address is too long)";
        event.preventDefault();
        test = false;
    }
    else if (!email.match(emailpat)) //not valid email format
    {
        document.getElementById("label-email").style.color = "red";
        document.getElementById("label-email").innerHTML = "Please enter valid email (example@example.com/ca)";
        event.preventDefault();
        test = false;
    }
   
    //Country
    var country = document.getElementById("country").value;
    if (country === "00" || country === "") //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your country";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }

    //Province
    var province = document.getElementById("province").value;
    if (province === "00" || province === "") //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your province";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }

    //City
    var city = document.getElementById("city").value;
    if (city === "00" || city === "" || city.length === 0) //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your city";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }

    //Salon
    var salon = document.getElementById("salon").value;
    if (salon === "00" || salon === "" || salon.length === 0) //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your city";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }
}

function scorePassword(pass)
{
    var score = 0;
    if (!pass)
        return score;

    //Award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i = 0; i < pass.length; i++)
    {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    //Bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    variationCount = 0;
    for (var check in variations)
    {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);
}

/* This function is called every time a password is entered to signup,
   or change passwords. It checks how strong the password is based
   on score given in score password function*/
function passwordStrength(event)
{
    var current = event.currentTarget.value;
    var score = scorePassword(current);
    var warning = document.getElementById("passwordStrength");

    if (score >= 100) //high score
    {
        warning.className = "veryGood";
        warning.innerHTML = "";
        warning.innerHTML = "Very Strong";
    }
    else if (score >= 80)
    {
        warning.className = "veryGood";
        warning.innerHTML = "";
        warning.innerHTML = "Strong";
    }
    else if (score >= 60)
    {
        warning.className = "good";
        warning.innerHTML = "";
        warning.innerHTML = "Good";
    }
    else if (score >= 30)
    {
        warning.className = "weak";
        warning.innerHTML = "";
        warning.innerHTML = "Weak";
    }
    else if (score < 30) //very weak not allowed to be used on the site
    {
        warning.className = "weak";
        warning.innerHTML = "";
        warning.innerHTML = "Very Weak";
    }

    return "";
}
/*This function is used both for adding a stylist, 
  and manager settings.As the user clicks off of the 
  input field this function is called to check if the 
  salon is valid*/
function validateSalon(event)
{
    var salon = event.currentTarget.value;

    if (salon == "00" || salon == "" || salon.length == 0) //Invalid
    {
        document.getElementById("invalid-locaton").style.color = "red";
    }
}

/*This function is used on all settings pages.
  When the user clicks the submit email button check if the 
  email is valid*/
function submitEmail(event) //Manager, customer, and employee settings
{
    //Email
    var email = document.getElementById("email").value;
    var emailpat = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/;
    
    //applies normal style
    document.getElementById("label-email").innerHTML = "Change Email:";
    document.getElementById("label-email").style.color = "#000";
    
    if (email === "" || email.length === 0) //checks if empty
    {
        document.getElementById("label-email").style.color = "red";
        event.preventDefault();
        test = false;
    }
    else if (email.length > 256) //invalid
    {
        document.getElementById("label-email").style.color = "red";
        document.getElementById("label-email").innerHTML = "Email address is too long)";
        event.preventDefault();
        test = false;
    }
    else if (!email.match(emailpat)) //invalid
    {
        document.getElementById("label-email").style.color = "red";
        document.getElementById("label-email").innerHTML = "Please enter valid email (example@example.com/ca)";
        event.preventDefault();
        test = false;
    }
}
/*This function is used on all settings pages.
  When the user clicks the submit password button check if the 
  password is valid*/
function submitPassword(event) //Manager, customer, and employee settings
{
    //Passwords
    var password = document.getElementById("password").value;
    var password2 = document.getElementById("passwordRepeat").value;
    
    if (password === "" || password.length === 0) //checks if empty
    {
        document.getElementById("label-password").style.color = "red";
        event.preventDefault();
        test = false;
    }
    if (password2 === "" || password2.length === 0) //checks if empty->confirmation password 
    {
        document.getElementById("label-passwordConfirm").style.color = "red";
        event.preventDefault();
        test = false;
    }

    if (password !== password2)
    {
        document.getElementById("label-password").innerHTML = "Passwords Do Not Match";
        document.getElementById("label-password").style.color = "red";
        document.getElementById("label-password").style.fontSize = "10px";
        event.preventDefault();
        test = false;
    }
    else //passwords match
    {
        if (password.length >= 96) //invlaid
        {
            document.getElementById("label-password").innerHTML = "Max Length Has Been Reached"
            document.getElementById("label-password").style.color = "red";
            document.getElementById("label-password").style.fontSize = "10px";
            event.preventDefault();
            test = false;
        }
        else
        {
            var score = scorePassword(password);
            if (score < 60) //invalid
            {
                document.getElementById("label-password").innerHTML = "Password is not Strong Enough";
                document.getElementById("label-password").style.color = "red";
                document.getElementById("label-password").style.fontSize = "10px";
                event.preventDefault();
                test = false;
            }
            else //valid
            {
                document.getElementById("label-password").innerHTML = "Change Password:";
                document.getElementById("label-password").style.color = "#000";
                document.getElementById("label-passwordConfirm").style.color = "#000";
                document.getElementById("label-password").style.fontSize = "16px";
            }
        }
    }
}

/*This function is used on manager settings page.
  When the user clicks the submit location button 
  check if the new location including salon is valid*/
function submitLocation(event) //Manager settings
{
    //Country
    var country = document.getElementById("country").value;
    if (country === "00" || country === "") //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your country";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }

    //Province
    var province = document.getElementById("province").value;
    if (province === "00" || province === "") //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your province";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }

    //City
    var city = document.getElementById("city").value;
    if (city === "00" || city === "" || city.length === 0) //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your city";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }

    //Salon
    var salon = document.getElementById("salon").value;
    if (salon === "00" || salon === "" || salon.length === 0) //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your salon";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }
}
/*This function is used on customer settings page.
  When the user clicks the submit location button 
  check if the new location is valid*/
function submitCustomerLocation(event) //Customer settings
{
    //Country
    var country = document.getElementById("country").value;
    if (country === "00" || country === "") //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your country";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }
    //Province
    var province = document.getElementById("province").value;
    if (province === "00" || province === "") //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your province";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }
    //City
    var city = document.getElementById("city").value;
    if (city === "00" || city === "" || city.length === 0) //checks if empty
    {
        document.getElementById("label-location").innerHTML = "Please enter your city";
        document.getElementById("label-location").style.color = "red";
        event.preventDefault();
        test = false;
    }
}
/*This function is used on manager settings page.
  When the user clicks the delete stylist button 
  check if a stylist has been choosen. If so create 
  a popup to confirm that the manger wants to delete
  the account*/
function deleteStylist(event) //Manager settings
{
    var account = document.getElementById("stylistAccounts").value;

    if (account != "00")//stylist has been selected
    {
        var modal = document.getElementById("popup");

        modal.style.display = "block"; //show popup
        var inner = document.getElementById("popup__content");
        var r = document.createElement('span');
        r.innerHTML = "";
        r.innerHTML = "Are you sure you want to delete " + account + "?";

        //create cancel button
        var z = document.createElement("BUTTON");
        z.setAttribute("type", "button");
        z.setAttribute("id", "cancelDeletion");
        z.setAttribute("class", "sumbit");
        z.className = "sumbit";
        var t = document.createTextNode("Cancel");
        z.appendChild(t)
        r.appendChild(z);

        //create submit button
        var x = document.createElement("INPUT");
        x.setAttribute("type", "submit");
        x.setAttribute("id", "saveDeletion");
        x.setAttribute("class", "sumbit");
        x.className = "sumbit";
        r.appendChild(x);
        inner.appendChild(r);

        //style buttons
        document.getElementById("cancelDeletion").className = "stop";
        document.getElementById("saveDeletion").className = "save";
        
        document.getElementById("cancelDeletion").addEventListener("click", closeEditProfilePic);
        document.getElementById("label-stylistAccounts").style.color = "black";
    }
    else //stylist not entered
    {
        document.getElementById("label-stylistAccounts").style.color = "red";
    }
}
/*This function is used on customersettings page.
  When the user clicks the delete account button 
  create a popup to confirm that the user wants 
  to delete the account*/
function deleteAccount(event) //customer settings
{
    //fill and display popup
    var modal = document.getElementById("popup");
    modal.style.display = "block";
    var inner = document.getElementById("popup__content");
    var r = document.createElement('span');
    r.innerHTML = "";
    r.innerHTML = "Are you sure you want to delete your account?"

    //create cancel button
    var z = document.createElement("BUTTON");
    z.setAttribute("type", "button");
    z.setAttribute("id", "cancelDeletion");
    z.setAttribute("class", "sumbit");
    z.className = "sumbit";
    var t = document.createTextNode("Cancel");
    z.appendChild(t)
    r.appendChild(z);

    //create submit button
    var x = document.createElement("INPUT");
    x.setAttribute("type", "submit");
    x.setAttribute("id", "saveDeletion");
    x.setAttribute("class", "sumbit");
    x.className = "sumbit";
    r.appendChild(x);
    inner.appendChild(r);
    //style buttons
    document.getElementById("cancelDeletion").className = "stop";
    document.getElementById("saveDeletion").className = "save";
    //add closing popup feature
    document.getElementById("cancelDeletion").addEventListener("click", closeEditProfilePic);
}

/*This function was for previous version of employee calendar
  will be removed once all dependencies are checked*/
function addAppointment(event) //WHAT IS THIS FOR?
{
    var first = document.getElementById("appointmentName").value; //for appointment name

    if (first === "" || first.length === 0) //checks if empty
    {
        document.getElementById("label-appointmentName").style.color = "red";
        event.preventDefault();
    }
    else if (first > 60)
    {
        document.getElementById("label-appointmentName").style.color = "red";
        document.getElementById("label-appointmentName").innerHTML = "Name less then 60 characters";
        event.preventDefault();
    }
    else
    {
        document.getElementById("label-appointmentName").innerHTML = "Appointment Title";
        document.getElementById("label-appointmentName").style.color = "#000";
    }

    //Appointment Description
    var first = document.getElementById("appointmentDetails").value; //for appointment name
    if (first > 150)
    {
        document.getElementById("label-appointmentDetails").style.color = "red";
        document.getElementById("label-appointmentDetails").innerHTML = "Name less then 60 characters";
        event.preventDefault();
    }
    else
    {
        document.getElementById("label-appointmentDetails").innerHTML = "Appointment Description";
        document.getElementById("label-appointmentDetails").style.color = "#000";
    }

    //Appointment start date
    var start = document.getElementById("start").value; //for appointment start date/time
    if (!start.match(/^(([0]?[1-9]|1[0-2])([0-2]?[0-9]|3[0-1])[1-2]d{3}) (20|21|22|23|[0-1]?d{1}):([0-5]?d{1})$/))
    {
        document.getElementById("label-start").style.color = "red";
        document.getElementById("label-start").innerHTML = "Enter valid date yyyy-mm-dd-hh-mm";
        event.preventDefault();
    }
    else
    {
        document.getElementById("label-start").innerHTML = "Start Date";
        document.getElementById("label-start").style.color = "#000";
    }

    //Appointment end date
    var end = document.getElementById("end").value; //for appointment end date/time
    if (!end.match(/^(([0]?[1-9]|1[0-2])([0-2]?[0-9]|3[0-1])[1-2]d{3}) (20|21|22|23|[0-1]?d{1}):([0-5]?d{1})$/))
    {
        document.getElementById("label-end").style.color = "red";
        document.getElementById("label-end").innerHTML = "Enter valid date yyyy-mm-dd-hh-mm";
        event.preventDefault();
    }
    else
    {
        document.getElementById("label-end").innerHTML = "End Date";
        document.getElementById("label-end").style.color = "#000";
    }
}

function openHairstylistWindow(event)
{
    var modal = document.getElementById("popupStylist");
    modal.style.display = "block";
}

function stylistListeners(event)
{
    var stylists = document.getElementsByClassName("employeeInfo");

    for (i = 0; i < stylists.length; i++)
    {
        stylists[i].addEventListener("click", selectHairstylist);
    }
}

function selectHairstylist(event)
{
    if (event.target.tagName == "DIV")
    {
        document.getElementById("selectedHairstylist").innerHTML = event.target.id;
    }
    else
    {
        document.getElementById("selectedHairstylist").innerHTML = event.target.parentNode.id;
    }

    document.getElementById("label-selectStylist").style.color = "";

    closeSelectHairstylist();
}

function closeSelectHairstylist(event)
{
    var modal = document.getElementById("popupStylist");
    modal.style.display = "none";
}

//Stylist Profile View
function swapProfileInfo(event)
{
    var id = this.id;
    document.getElementById("p-lgm-1").className = "hide";
    document.getElementById("p-lgm-2").className = "hide";
    document.getElementById("p-lgm-3").className = "hide";
    document.getElementById("lgm-1").className = "unactive";
    document.getElementById("lgm-2").className = "unactive";
    document.getElementById("lgm-3").className = "unactive";
    document.getElementById(id).className = "active";
    document.getElementById("p-" + id).className = "stylemod_tab show";
}
/*This function is used on customer profile and employee profile pages.
  When the user hovers over his/her profile pic a little edit icon appears*/
function hoverProfilePic(event)
{
    document.getElementById("editProfilePic").style.display = "block";
}
/*This function is used on customer profile and employee profile pages.
  When the user hovers off his/her profile pic a little edit icon disappears*/
function offhoverProfilePic(event)
{
    document.getElementById("editProfilePic").style.display = "none";
}
/*This function is used on employee profile pages.
  It allows employee to edit information about themselves 
  edit icon is clicked*/
function editOverview(event)
{
    var place = document.getElementById("p-lgm-1");
    var text = place.textContent;
    place.innerHTML = "";
    var r = document.createElement('span');
    r.setAttribute("id", "overviewForm__wrapper");
    //creates input box
    var y = document.createElement("TEXTAREA"); 

    y.setAttribute("value", text);
    y.setAttribute("cols", "160");
    y.setAttribute("rows", "15");
    y.setAttribute("Name", "textelement_overview");
    y.setAttribute("id", "textelement_overview");
    r.appendChild(y);
    //creates cancel button
    var z = document.createElement("BUTTON");
    z.setAttribute("type", "button");
    z.setAttribute("id", "overviewCancel");
    z.setAttribute("class", "sumbit");
    z.className = "sumbit";
    var t = document.createTextNode("Cancel");
    z.appendChild(t)
    r.appendChild(z);
    //creates submit button
    var x = document.createElement("INPUT");
    x.setAttribute("type", "submit");
    //x.setAttribute("", "submit");
    x.setAttribute("class", "sumbit");
    x.setAttribute("id", "overviewSubmit");
    x.className = "sumbit";
    r.appendChild(x);
    place.appendChild(r);
    document.getElementById("textelement_overview").value = text;
    document.getElementById("overviewCancel").className = "stop";
    document.getElementById("overviewSubmit").className = "save";
    document.getElementById("overviewCancel").addEventListener("click", closeEditOverview);
}
/*On employee profile page when cancel button is clicked close editing mode*/
function closeEditOverview()
{
    document.getElementById("overviewForm__wrapper").style.display = "none";
}
/*This function is used on employee profile pages.
  It allows employee to edit information about themselves 
  edit icon is clicked*/
function editEducation(event)
{
    var place = document.getElementById("p-lgm-2");
    var text = place.textContent;
    place.innerHTML = "";
    var r = document.createElement('span');
    r.setAttribute("Name", "educationForm__wrapper");
    r.setAttribute("id", "educationForm__wrapper");
    //creates text area
    var y = document.createElement("TEXTAREA");

    y.setAttribute("value", text);
    y.setAttribute("cols", "160");
    y.setAttribute("rows", "15");
    y.setAttribute("Name", "textelement_education");
    y.setAttribute("id", "textelement_education");
    r.appendChild(y);
    //cancel button
    var z = document.createElement("BUTTON");
    z.setAttribute("type", "button");
    z.setAttribute("id", "cancelEducation");
    //x.setAttribute("", "submit");
    z.setAttribute("class", "sumbit");
    z.className = "sumbit";
    var t = document.createTextNode("Cancel");
    z.appendChild(t)
    r.appendChild(z);
    //submit button
    var x = document.createElement("INPUT");
    x.setAttribute("type", "submit");
    //x.setAttribute("", "submit");
    x.setAttribute("class", "sumbit");
    x.setAttribute("id", "saveEducation");
    x.className = "sumbit";
    r.appendChild(x);
    place.appendChild(r);
    document.getElementById("textelement_education").value = text;
    document.getElementById("cancelEducation").className = "stop";
    document.getElementById("saveEducation").className = "save";
    document.getElementById("cancelEducation").addEventListener("click", closeEditEducation);

}
/*On employee profile page when cancel button is clicked close editing mode*/
function closeEditEducation()
{
    document.getElementById("educationForm__wrapper").style.display = "none";
}
/*This function is used on employee profile pages.
  It allows employee to add and remove pictures
  from their portfolio when edit icon is clicked*/
function editGallery(event)
{
    var place = document.getElementById("addPhoto");
    var r = document.createElement('span');
    r.setAttribute("id", "galleryForm__wrapper");
    r.setAttribute("name", "gallleryForm__wrapper");
    
    var y = document.createElement("INPUT");
    y.setAttribute("type", "file");
    y.setAttribute("Name", "file_gallery");
    y.setAttribute("id", "file_gallery");
    r.appendChild(y);
   
    //cancel button
    var z = document.createElement("BUTTON");
    z.setAttribute("type", "button");
    z.setAttribute("id", "cancelGallery");
    z.setAttribute("class", "sumbit");
    z.className = "sumbit";
    var t = document.createTextNode("Cancel");
    z.appendChild(t)
    r.appendChild(z);
    //submit button
    var x = document.createElement("INPUT");
    x.setAttribute("type", "submit");
    x.setAttribute("id", "saveGallery");
    x.setAttribute("class", "sumbit");
    x.className = "sumbit";
    r.appendChild(x);
    place.appendChild(r);

    //style buttons
    document.getElementById("cancelGallery").className = "stop";
    document.getElementById("saveGallery").className = "save";

    document.getElementById("cancelGallery").addEventListener("click", closeEditGallery);

    var container;
    var items;
    var pics;
    container = document.getElementById("og-grid");
    items = container.getElementsByClassName("deletePhoto");
    pics = container.getElementsByTagName("li");
    //for each picture add deletion x's
    for (var j = 0; j < items.length; j++)
    {
        items[j].style.display = "block";
        items[j].addEventListener("click", photoDelete);
    }
}
/*On employee profile page when cancel button is clicked close editing mode*/
function closeEditGallery(event)
{
    document.getElementById("galleryForm__wrapper").style.display = "none";
    var container;
    var items;
    var pics;
    container = document.getElementById("og-grid");
    items = container.getElementsByClassName("deletePhoto");
    pics = container.getElementsByTagName("li");

    for (var j = 0; j < items.length; j++) //remove deletion x's
    {
        items[j].style.display = "none";
        items[j].removeEventListener("click", photoDelete);
    }
}
/*This function is used on employee profile and customer profile pages.
  It allows user to change profile pictures through a popup windoww
  when edit icon is clicked*/
function editProfilePic(event)
{
    //display popup
    var modal = document.getElementById("popup");
    modal.style.display = "block";
    var inner = document.getElementById("popup__content");
    var r = document.createElement('span');
    r.setAttribute("id", "picForm__wrapper");
    //file upload input
    var y = document.createElement("INPUT");
    y.setAttribute("type", "file");
    y.setAttribute("Name", "file_profile");
    y.setAttribute("id", "file_profile");
    r.appendChild(y);
    //cancel button
    var z = document.createElement("BUTTON");
    z.setAttribute("type", "button");
    z.setAttribute("id", "cancelProfilePic");
    z.setAttribute("class", "sumbit");
    z.className = "sumbit";
    var t = document.createTextNode("Cancel");
    z.appendChild(t)
    r.appendChild(z);
    //save picture button
    var x = document.createElement("INPUT");
    x.setAttribute("type", "submit");
    x.setAttribute("id", "saveProfilePic");
    x.setAttribute("class", "sumbit");
    x.className = "sumbit";
    r.appendChild(x);
    inner.appendChild(r);

    document.getElementById("cancelProfilePic").className = "stop";
    document.getElementById("saveProfilePic").className = "save";
    document.getElementById("cancelProfilePic").addEventListener("click", closeEditProfilePic);
}
/*On customer and employee profile page when cancel button is clicked close editing mode*/
function closeEditProfilePic(event)
{
    var modal = document.getElementById("popup");
    modal.style.display = "none";
}
/*On employee profile page when in edit mode delete photo from gallery*/
function photoDelete(event)
{
    parentDiv = event.currentTarget.parentNode;
    parentDiv.style.display = "none";
    var arr = parentDiv.getElementsByTagName("a");

    arr.style.display = "none";
    arr.src = "#";
    arr.href = "#";
}
/*used whenever popup is created to close the popup window*/
function closeEventPopup(event)
{
    var modal = document.getElementById("popup");
    modal.style.display = "none";
}
