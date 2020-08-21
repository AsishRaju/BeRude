const usernameRef = document.querySelector(".username");
const submitBtnRef = document.querySelector(".submit");
const listRef = document.querySelector(".unFUser");
const errorRef = document.querySelector(".error");
const spinner = document.querySelector(".spinner-border");

var gh = new GitHub();
const generateTemplate = (user) => {
	const htmlTemplate = `<li class="list-group-item d-flex justify-content-between align-items-center">
    <a  class="link" target="_blank" href="${user.html_url}">${user.login}</a>
    <i class="fas fa-times delete" style="color:red;"></i>
    </li>`;
	listRef.innerHTML = htmlTemplate + listRef.innerHTML;
};

listRef.addEventListener("click", (e) => {
	if (e.target.classList.contains("delete")) {
		e.target.parentElement.remove();
		const toDelete = e.target.parentElement.textContent.trim();
		todosList = todosList.filter((item) => {
			return item !== toDelete;
		});
		localStorage.clear();
		localStorage.setItem("prevTodos", JSON.stringify(todosList));
	}
});

submitBtnRef.addEventListener("click", (e) => {
	e.preventDefault();
	listRef.innerHTML = "";
	errorRef.innerHTML = "";
	const userName = usernameRef.value.trim();
	spinner.classList.remove("d-none");

	gh.get(`users/${userName}/followers`, { all: true }, function (err, followers) {
		if (err) {
			console.log(err);
			spinner.classList.add("d-none");
			errorRef.innerHTML = "User Not Found";
		} else {
			errorRef.innerHTML = "";
			gh.get(`users/${userName}/following`, { all: true }, function (err, following) {
				if (err) {
					console.log(err);
				} else {
					var diffrence = following.filter(function (obj) {
						return !followers.some(function (obj2) {
							return obj.login == obj2.login;
						});
					});

					diffrence.forEach((user) => {
						generateTemplate(user);
					});
					spinner.classList.add("d-none");
				}
			});
		}
	});
});
