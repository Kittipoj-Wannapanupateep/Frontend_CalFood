/******************************** Profile setting (ขีด 3 ขีด)  ***********************************/
document.addEventListener("DOMContentLoaded", function () {
    const settingIcon = document.getElementById("setting");
    const settingsMenu = document.createElement("div");

    settingsMenu.classList.add("settings-menu");
    settingsMenu.innerHTML = `
        <a href="Profile_Login.html">ตั้งค่าโปรไฟล์</a>
        <a href="Home_Logout.html">ออกจากระบบ</a>
    `;

    document.querySelector(".account").appendChild(settingsMenu);

    settingIcon.addEventListener("click", function () {
        settingsMenu.classList.toggle("show-menu");
    });

    // ปิดเมนูเมื่อคลิกข้างนอก
    document.addEventListener("click", function (event) {
        if (!settingIcon.contains(event.target) && !settingsMenu.contains(event.target)) {
            settingsMenu.classList.remove("show-menu");
        }
    });
});
 
