document.getElementById("country").addEventListener("blur", validateLocation);
document.getElementById("province").addEventListener("blur", validateLocation);
document.getElementById("city").addEventListener("blur", validateLocation);
document.getElementById("province").addEventListener("blur", populateCities);
document.getElementById("province").addEventListener("change", populateCities);
document.getElementById("email").addEventListener("blur", submitEmail);
document.getElementById("email").addEventListener("keyup", submitEmail);
document.getElementById("password").addEventListener("blur", submitPassword);
document.getElementById("password").addEventListener("keyup", submitPassword);
document.getElementById("passwordRepeat").addEventListener("blur", submitPassword);
document.getElementById("passwordRepeat").addEventListener("keyup", submitPassword);
document.getElementsByClassName("close")[0].addEventListener("click", closeEditProfilePic);
document.getElementById("saveEmail").addEventListener("click", submitEmail);
document.getElementById("savePassword").addEventListener("click", submitPassword);
document.getElementById("saveLocation").addEventListener("click", submitLocation);
document.getElementById("deleteStylist").addEventListener("click", deleteStylist);

