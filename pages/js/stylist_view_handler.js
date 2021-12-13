window.addEventListener("load", populateServices);
document.getElementById("newStylistAppointment").addEventListener("click", updateStylistCalendar);
document.getElementById("selectHairstyle").addEventListener("change", verifyHairstyle);
document.getElementById("specialRequest").addEventListener("keyup", verifyDetails);
document.getElementsByClassName("close")[0].addEventListener("click", closeEvent);
document.getElementsByClassName("close")[1].addEventListener("click", closeEventMeeting);
cancelAppointmentButton.addEventListener("click", cancelEvent);