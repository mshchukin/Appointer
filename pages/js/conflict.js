function conflict(start, end, events) //Checks for conflicting calendar events
{
    for (i = 0; i < events.length; i++) //Loop through all of the existing events
    {
        //Return true if the new event conflicts with an existing one
        if (start.isSame(events[i].start) || end.isSame(events[i].end))
        {
            return true;
        }
        else if (start.isAfter(events[i].start) && start.isBefore(events[i].end))
        {
            return true;
        }
        else if (end.isAfter(events[i].start) && end.isBefore(events[i].end))
        {
            return true;
        }
        else if (start.isBefore(events[i].start) && end.isAfter(events[i].end))
        {
            return true;
        }
    }

    return false //Return false if the new event does not conflict with an existing one
}