const usernameRef = document.querySelector(".username");
const listRef = document.querySelector(".unFUser");
var todosList = [];
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

usernameRef.addEventListener("submit", (e) => {
	e.preventDefault();
	listRef.innerHTML = "";
	const userName = usernameRef.inputField.value.trim();
	let following;
	let followers;
	axios
		.get(`https://api.github.com/users/${userName}/following`)
		.then((response) => {
			following = response.data;
		})
		.catch((error) => {
			console.log(error);
		})
		.then(() => {
			axios
				.get(`https://api.github.com/users/${userName}/followers`)
				.then(function (response) {
					followers = response.data;
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					var diffrence = following.filter(function (obj) {
						return !followers.some(function (obj2) {
							return obj.login == obj2.login;
						});
					});
					diffrence.forEach((user) => {
						console.log(user);
						generateTemplate(user);
					});
				});
		});
});

if (localStorage.getItem("prevTodos")) {
	JSON.parse(localStorage.getItem("prevTodos")).forEach((Element) => {
		todosList.push(Element);
		generateTemplate(Element);
	});
}
