<?php
//CREATED BY MITCHELL STEFFENSEN AND MIKHAIL SHCHUKIN
if(!defined('ALLOW_ACCESS')) exit(header('Location: /')); //Only allow access to this file through the router

class Salon
{
    public $database; //Stores the database connection

    public function __construct($database) //Set up the salon by copying the specified database connection
    {
        $this->database = $database; //Copy the database connection
    }

    public function getBusinessHoursJSON($location) //Get the business hours and output them as JSON
    {
        $hoursQuery = $this->database->query('SELECT open, close FROM businesshours WHERE location = ? LIMIT 1', $location); //Get the business hours from the database
        $hours = array(); //Stores the hours

        if($this->database->rowCount($hoursQuery)) //The query returned at least one result
        {
            while($hoursRow = $this->database->fetch($hoursQuery)) //Loop through and fetch each row
            {
                $hours['open'] = $hoursRow['open']; //Add the opening hour to the hours array
                $hours['close'] = $hoursRow['close']; //Add the closing hour to the hours array
            }
        }

        print json_encode($hours); //Encode and output the services as JSON
    }

    public function getServicesJSON() //Get the list of services and output it as JSON
    {
        $serviceQuery = $this->database->query('SELECT * FROM services'); //Get the services from the database
        $services = array(); //Stores the services

        if($this->database->rowCount($serviceQuery)) //The query returned at least one result
        {
            while($serviceRow = $this->database->fetch($serviceQuery)) //Loop through and fetch each row
            {
                $services[] = $serviceRow; //Add each service to the services array
            }
        }

        print json_encode($services); //Encode and output the services as JSON
    }

    public function getLocationsJSON($country, $province, $city) //Get the list of locations and output it as JSON
    {
        $locationQuery = $this->database->query('SELECT id, address FROM locations WHERE country = ? AND province = ? AND city =?', $country, $province, $city); //Get the locations from the database
        $locations = array(); //Stores the locations

        if($this->database->rowCount($locationQuery)) //The query returned at least one result
        {
            while($locationRow = $this->database->fetch($locationQuery)) //Loop through and fetch each row
            {
                $locations[] = $locationRow; //Add each location to the locations array
            }
        }

        print json_encode($locations); //Encode and output the locations as JSON
    }

    public function getStylistsJSON() //Get the list of stylists and output it as JSON
    {
        $stylists = array(); //Stores the stylists

        if(isset($_POST['location'])) //The location variable is defined
        {
            $stylistQuery = $this->database->query('SELECT id, firstName, image FROM users WHERE rank = 1 AND location = ?', $_POST['location']); //Get the stylists from the database

            if($this->database->rowCount($stylistQuery)) //The query returned at least one result
            {
                while($stylistRow = $this->database->fetch($stylistQuery)) //Loop through and fetch each row
                {
                    $stylists[] = $stylistRow; //Add each stylist to the locations array
                }
            }
        }

        print json_encode($stylists); //Encode and output the stylists as JSON
    }

    public function getUnavailableTimesJSON($id, $rank, $location) //Get the list of unavailable times and output it as JSON
    {
        $unavailableTimes = array(); //Store the unavailable times

        if(isset($_GET['start']) && isset($_GET['end'])) //The required GET variables are set
        {
            $start = strtotime($_GET['start'] . ' 0:00:00 GMT'); //Add time to the start variable
            $end = strtotime($_GET['end'] . ' 23:59:59 GMT'); //Add time to the end variable

            //Get all relevent appointments based on rank
            if($rank == 2) //Manager
            {
                $appUserQuery = $this->database->query('SELECT * FROM appointments WHERE start >= ? AND end <= ? AND location = ? AND title != \'Meeting\'', $start, $end, $location); //Get all appointments from the database
            }
            else if($rank == 1) //Stylist
            {
                $appUserQuery = $this->database->query('SELECT * FROM appointments WHERE stylist = ? AND start >= ? AND end <= ? AND title != \'Meeting\'', $id, $start, $end); //Get all of the stylist's appointments from the database
            }
            else //Customer
            {
                $appUserQuery = $this->database->query('SELECT * FROM appointments WHERE user = ? AND start >= ? AND end <= ? AND title != \'Meeting\'', $id, $start, $end); //Get all of the customer's appointments from the database
            }

            if($this->database->rowCount($appUserQuery)) //The query returned at least one row
            {
                while($appUserRow = $this->database->fetch($appUserQuery)) //Loop through and fetch each row
                {
                    //Create the appointment event
                    $userApp['id'] = $appUserRow['id'];
                    $userApp['title'] = $appUserRow['title'];
                    $userApp['start'] = date('Y-m-d\TH:i:s', $appUserRow['start']);
                    $userApp['end'] = date('Y-m-d\TH:i:s', $appUserRow['end']);
                    $userApp['serviceName'] = $this->getServiceName($appUserRow['service']);
                    $userApp['stylistName'] = $this->getStylistManagerName($appUserRow['stylist']);
                    $userApp['locationName'] = $this->getLocationAddress($appUserRow['location']);
                    $userApp['details'] = $appUserRow['details'];
                    $userApp['image'] = $appUserRow['image'];

                    $unavailableTimes[] = $userApp; //Add the appointment to the unavailable times
                }
            }

            //Get all meetings
            $meetingsQuery = $this->database->query('SELECT * FROM appointments WHERE start >= ? AND end <= ? AND location = ? AND title = \'Meeting\'', $start, $end, $location); //Get all meetings from the database

            if($this->database->rowCount($meetingsQuery)) //The query returned at least one row
            {
                while($meetingsRow = $this->database->fetch($meetingsQuery)) //Loop through and fetch each row
                {
                    //Create the meeting event
                    if($rank > 0) //The user is a customer
                    {
                        //Set the meeting as a grey unavailable event
                        $meeting['title'] = $meetingsRow['title'];
                        $meeting['color'] = '#008888';
                    }
                    else //The user is a stylist or a manager
                    {
                        //Set the meeting as a teal meeting event
                       $meeting['title'] = 'Unavailable';
                       $meeting['color'] = '#BBB';
                    }

                    $meeting['id'] = $meetingsRow['id'];
                    $meeting['start'] = date('Y-m-d\TH:i:s', $meetingsRow['start']);
                    $meeting['end'] = date('Y-m-d\TH:i:s', $meetingsRow['end']);
                    $meeting['serviceName'] = '';
                    $meeting['stylistName'] = $this->getStylistManagerName($meetingsRow['stylist']);
                    $meeting['locationName'] = $this->getLocationAddress($meetingsRow['location']);
                    $meeting['details'] = $meetingsRow['details'];
                    $meeting['image'] = '';

                    $unavailableTimes[] = $meeting; //Add the meeting to the unavailable times
                }
            }

            $days = array(); //Stores the unavailable business days

            if($location != null) //The location variable is set
            {
                $daysQuery = $this->database->query('SELECT sun, mon, tues, wed, thurs, fri, sat FROM businessHours WHERE location = ? LIMIT 1', $location); //Get all business days from the database

                if($this->database->rowCount($daysQuery)) //The query returned a row
                {
                    $daysRow = $this->database->fetch($daysQuery); //Fetch the row
                    $curDay = 0; //Set the current day

                    foreach($daysRow as $data) //Loop through each day
                    {
                        if(!$data) //The location is closed on the current day
                        {
                            $days[] = $curDay; //Add the current day to the days array
                        }

                        $curDay++; //Increment the current day
                    }

                    if(count($days)) //There are days in the days array
                    {
                        //Create the business days event
                        $businessDays['title'] = 'Closed';
                        $businessDays['start'] = '00:00:00';
                        $businessDays['end'] = '24:00:00';
                        $businessDays['color'] = '#BBB';
                        $businessDays['dow'] = $days;

                        $unavailableTimes[] = $businessDays; //Add the days to the unavailable times
                    }
                }
            }

            if(isset($_GET['stylist'])) //The stylist GET variable is set
            {
                $appStylistQuery = $this->database->query('SELECT * FROM appointments WHERE user != ? AND stylist = ? AND start >= ? AND end <= ?', $id, $_GET['stylist'], $start, $end); //Get all stylist appointments from the database

                if($this->database->rowCount($appStylistQuery)) //The query returned a row
                {
                    while($appStylistRow = $this->database->fetch($appStylistQuery)) //Loop through each appointment row
                    {
                        //Create the stylist appointment event
                        $stylistApp['title'] = 'Unavailable';
                        $stylistApp['start'] = date('Y-m-d\TH:i:s', $appStylistRow['start']);
                        $stylistApp['end'] = date('Y-m-d\TH:i:s', $appStylistRow['end']);
                        $stylistApp['color'] = '#BBB';

                        $unavailableTimes[] = $stylistApp; //Add the appointment to the unavailable times
                    }
                }
            }

            //Get the stylist availability
            $stylist = null; //Create a temporary stylist variable

            if($rank == 0 && isset($_GET['stylist'])) //The user is a customer and the stylist GET variable is set
            {
                $stylist = $_GET['stylist']; //Set the stylist variable
            }
            else if($rank == 1) //The user is a stylist
            {
                $stylist = $id; //Set the stylist variable
            }

            if($stylist != null && $rank < 2) //The stylist variable is set and the user is not a manager
            {
                $stylistDaysQuery = $this->database->query('SELECT sun, mon, tues, wed, thurs, fri, sat FROM availability WHERE stylist = ? LIMIT 1', $stylist); //Get the stylist availability from the database

                if($this->database->rowCount($stylistDaysQuery)) //The query returned a row
                {
                    $stylistDaysRow = $this->database->fetch($stylistDaysQuery); //Fetch the row
                    $curStylistDay = 0; //Set the current day
                    $stylistDays = array(); //Stores the stylists unavailbable days

                    foreach($stylistDaysRow as $data) //Loop through each day
                    {
                        if(!$data && !in_array($curStylistDay, $days)) //The stylist is unaivable and it's not a day where the location is closed
                        {
                            $stylistDays[] = $curStylistDay; //Add the current day to the days array
                        }

                        $curStylistDay++; //Increment the current day
                    }

                    if(count($stylistDays)) //There are days in the stylist days array
                    {
                        //Create the availability event
                        $availability['title'] = 'Unavailable';
                        $availability['start'] = '00:00:00';
                        $availability['end'] = '24:00:00';
                        $availability['color'] = '#BBB';
                        $availability['dow'] = $stylistDays;

                        $unavailableTimes[] = $availability; //Add the days to the unavailable times
                    }
                }
            }
        }

        print json_encode($unavailableTimes); //Encode and output the unavailable times as JSON
    }

    public function getServiceName($id) //Get the name of a service from an ID
    {
        $serviceQuery = $this->database->query('SELECT service FROM services WHERE id = ? LIMIT 1', $id); //Get the service from the database

        if($this->database->rowCount($serviceQuery)) //The query returned a row
        {
            $serviceRow = $this->database->fetch($serviceQuery); //Fetch the row

            return $serviceRow['service']; //Return the service name
        }

        return ''; //Otherwise return and empty string
    }

    public function getStylistManagerName($id) //Get the name of a stylist or manager from an ID
    {
        $stylistManagerQuery = $this->database->query('SELECT firstName FROM users WHERE id = ? AND rank > 0 LIMIT 1', $id); //Get the stylist/manager from the database

        if($this->database->rowCount($stylistManagerQuery)) //The query returned a row
        {
            $stylistManagerRow = $this->database->fetch($stylistManagerQuery); //Fetch the row

            return $stylistManagerRow['firstName']; //Return the stylist/manager name
        }

        return ''; //Otherwise return and empty string
    }

    public function getLocationAddress($id) //Get the address of a location from an ID
    {
        $locationQuery = $this->database->query('SELECT address FROM locations WHERE id = ? LIMIT 1', $id); //Get the location from the database

        if($this->database->rowCount($locationQuery)) //The query returned a row
        {
            $locationRow = $this->database->fetch($locationQuery); //Fetch the row

            return $locationRow['address']; //Return the location address
        }

        return ''; //Otherwise return and empty string
    }

    public function cancelAppointment($userid, $rank) //Cancel an appointment
    {
        if($rank == 0 && isset($_POST['appointment']) && $this->database->query('DELETE FROM appointments WHERE id = ? AND user = ?', $_POST['appointment'], $userid)) //Delete the appointment (Customer)
        {
            print json_encode(array('success' => true)); //Output a JSON encoded success message
        }
        else if($rank == 1 && isset($_POST['appointment']) && $this->database->query('DELETE FROM appointments WHERE id = ? AND stylist = ?', $_POST['appointment'], $userid)) //Delete the appointment (Stylist)
        {
            print json_encode(array('success' => true)); //Output a JSON encoded success message
        }
        else if($rank == 2 && isset($_POST['appointment']) && $this->database->query('DELETE FROM appointments WHERE id = ?', $_POST['appointment'])) //Delete the appointment (Manager)
        {
            print json_encode(array('success' => true)); //Output a JSON encoded success message
        }
        else //Deleting the appointment failed
        {
            print json_encode(array('success' => false)); //Output a JSON encoded error message
        }
    }

    public function scheduleAppointment($userid, $location, $rank)
    {
        if(isset($_POST['stylist']) && isset($_POST['service']) && isset($_POST['details']) && isset($_POST['start']) && isset($_POST['end']) && isset($_POST['title']) && isset($_POST['image'])) //The required POST variables are set
        {
            if(!$this->database->rowCount($this->database->query('SELECT null FROM appointments WHERE ? = start OR ? = end OR (? > start AND ? < end) OR (? > start AND ? < end) OR (? < start AND ? > end)', strtotime($_POST['start']), strtotime($_POST['end']), strtotime($_POST['start']), strtotime($_POST['start']), strtotime($_POST['end']), strtotime($_POST['end']), strtotime($_POST['start']), strtotime($_POST['end'])))) //Check for conflicting appointments
            {
                //Set the start and end of the day of the appointment to check if the user already has an appointment on that day
                $startOfDay = strtotime(date('Y-m-d', strtotime($_POST['start'])) . ' 00:00:00 GMT');
                $endOfDay = strtotime(date('Y-m-d', strtotime($_POST['start'])) . ' 23:59:59 GMT');

                //Set the start and end of the business day to check if the appointment is within the business hours
                $startOfBusinessDay = $startOfDay;
                $endOfBusinessDay = $endOfDay;
                $hoursQuery = $this->database->query('SELECT open, close FROM businessHours WHERE location = ? LIMIT 1', $location); //Get the business hours from the database

                if($this->database->rowCount($hoursQuery)) //The query returned at least one result
                {
                    while($hoursRow = $this->database->fetch($hoursQuery)) //Loop through and fetch each row
                    {
                        $startOfBusinessDay = strtotime(date('Y-m-d', strtotime($_POST['start'])) . ' ' . $hoursRow['open'] . ':00:00 GMT'); //Set the start of the business day
                        $endOfBusinessDay = strtotime(date('Y-m-d', strtotime($_POST['start'])) . ' ' . $hoursRow['close'] . ':00:00 GMT'); //Set the end of the business day
                    }
                }

                if(isset($_POST['minDate']) && isset($_POST['maxDate']) && (strtotime($_POST['start']) < strtotime($_POST['minDate']) || strtotime($_POST['end']) > strtotime($_POST['maxDate']))) //Check if the appointment is out of range
                {
                    print json_encode(array('success' => false)); //Output a JSON encoded error message
                }
                else if(strtotime($_POST['start']) < $startOfBusinessDay || strtotime($_POST['end']) > $endOfBusinessDay) //Check if the appointment is not within the business hours
                {
                    print json_encode(array('success' => false)); //Output a JSON encoded error message
                }
                else if($rank == 0 && $this->database->rowCount($this->database->query('SELECT null FROM appointments WHERE user = ? AND start >= ? AND start <= ? LIMIT 1', $userid, $startOfDay, $endOfDay))) //The user already has an appointment scheduled on this day
                {
                    print json_encode(array('success' => false, 'message' => 'You can only have one appointment per day!')); //Output a JSON encoded error message
                }
                else if($rank == 0 && $this->database->query('INSERT INTO appointments (user, stylist, location, service, details, start, end, title, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', $userid, $_POST['stylist'], $location, $_POST['service'], $_POST['details'], strtotime($_POST['start']), strtotime($_POST['end']), $_POST['title'], $_POST['image'])) //Schedule the appointment
                {
                    print json_encode(array('success' => true)); //Output a JSON encoded success message
                }
                else if($rank == 1 && $this->database->query('INSERT INTO appointments (user, stylist, location, service, details, start, end, title, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 0, $userid, $location, $_POST['service'], $_POST['details'], strtotime($_POST['start']), strtotime($_POST['end']), $_POST['title'], $_POST['image'])) //Schedule the appointment
                {
                    print json_encode(array('success' => true)); //Output a JSON encoded success message
                }
                else if($rank == 2 && $this->database->query('INSERT INTO appointments (user, stylist, location, service, details, start, end, title, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 0, $userid, $location, $_POST['service'], $_POST['details'], strtotime($_POST['start']), strtotime($_POST['end']), $_POST['title'], $_POST['image'])) //Schedule the appointment
                {
                    print json_encode(array('success' => true)); //Output a JSON encoded success message
                }
                else //Scheduling the appointment failed
                {
                    print json_encode(array('success' => false)); //Output a JSON encoded error message
                }
            }
            else
            {
                print json_encode(array('success' => false)); //Output a JSON encoded error message
            }
        }
        else //The required POST variables are not set
        {
            print json_encode(array('success' => false)); //Output a JSON encoded error message
        }
    }
}