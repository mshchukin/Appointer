$(
    function()
    {
        for (i = new Date().getFullYear(); i > 1900; i--)
        {
            $("#years").append($("<option />").val(i).html(i));
        }

        for (i = 1; i < 13; i++)
        {
            if (i == 1)
                $("#months").append($("<option />").val(i).html("January"));
            else if (i == 2)
                $("#months").append($("<option />").val(i).html("February"));
            else if (i == 3)
                $("#months").append($("<option />").val(i).html("March"));
            else if (i == 4)
                $("#months").append($("<option />").val(i).html("April"));
            else if (i == 5)
                $("#months").append($("<option />").val(i).html("May"));
            else if (i == 6)
                $("#months").append($("<option />").val(i).html("June"));
            else if (i == 7)
                $("#months").append($("<option />").val(i).html("July"));
            else if (i == 8)
                $("#months").append($("<option />").val(i).html("August"));
            else if (i == 9)
                $("#months").append($("<option />").val(i).html("September"));
            else if (i == 10)
                $("#months").append($("<option />").val(i).html("October"));
            else if (i == 11)
                $("#months").append($("<option />").val(i).html("November"));
            else if (i == 12)
                $("#months").append($("<option />").val(i).html("December"));
        }

        updateNumberOfDays();

        $("#years, #months").change(
            function()
            {

                updateNumberOfDays();

            }
        );
    }
);

function updateNumberOfDays()
{
    $("#days").html("");
    month = $("#months").val();
    year = $("#years").val();
    days = daysInMonth(month, year);

    for (i = 1; i < days + 1; i++)
    {
        $("#days").append($("<option />").val(i).html(i));
    }
}

function daysInMonth(month, year)
{
    return new Date(year, month, 0).getDate();
}