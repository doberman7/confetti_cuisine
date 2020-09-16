$(document).ready(() => {//Wait for DOM to load.
  $("#modal-button").click(() => {//Listen for a click event on the modal button.
    $(".modal-body").html('');//Clear the modal from any previous content.
    $.get("/api/courses", (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return;
      data.courses.forEach((course) => {
        $(".modal-body").append(
          `<div>
            <span class="course-title">
              ${course.title}
              <button class="join-button" data-id="${course._id}">
                Join
              </button>
            </span>
            <div class='course-description'>
              ${course.description}
            </div>
          </div>`
        );
      });
    });
  });
});

$(document).ready(() => {
  $("#modal-button-user").click(() => {
    $(".modal-body").html('');
    $.get("/users?format=json", (data) => {//Request data from /users?format=json asynchronously.
      data.forEach((user) => {
        $(".modal-body").append(
          `<div>
                <span class="user-name">
                  ${user.name.first + " " + user.name.last}
                </span>
                <div class="user-email">
                  ${user.email}
                </div>

          </div>`
        );
      });
    });
  });
});
