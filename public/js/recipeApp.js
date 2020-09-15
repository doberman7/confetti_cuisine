$(document).ready(() => {//Wait for DOM to load.
  $("#modal-button").click(() => {//Listen for a click event on the modal button.
    $(".modal-body").html('');//Clear the modal from any previous content.
    $.get("/courses?format=json", (data) => { //Request data from /courses?format=json asynchronously.
      data.forEach((course) => { //Loop through array of data in the response.
        $(".modal-body").append(
          `<div>
          <span class="course-title">
          ${course.title}
          </span>
          <div class="course-description">
          ${course.description}
          </div>
          </div>`//Append each course to the modal.
        );
      });
    });
  });
});
