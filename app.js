
 // W12C - JavaScript Fetch API Assignment
 // GET, POST, PATCH, DELETE + BONUS COMMENTS

const url = "https://jsonplaceholder.typicode.com/posts";

// Store posts displayed on the website
let displayedPosts = [];
let nextPostNumber = 6;

// Five English example posts
const englishPosts = [
    {
        id: 1,
        title: "Welcome to My JavaScript Project",
        body: "This is my W12C assignment. I am learning how to build websites using JavaScript and the Fetch API."
    },
    {
        id: 2,
        title: "Learning Web Development",
        body: "Web development allows us to create interactive websites using HTML, CSS, and JavaScript."
    },
    {
        id: 3,
        title: "Understanding the Fetch API",
        body: "The Fetch API allows websites to communicate with servers and exchange information."
    },
    {
        id: 4,
        title: "Creating and Updating Posts",
        body: "JavaScript uses POST requests to create new information and PATCH requests to update existing information."
    },
    {
        id: 5,
        title: "Managing Information Online",
        body: "Web applications use GET requests to retrieve information and DELETE requests to remove records."
    }
];


// =====================================
// DISPLAY POSTS AND COMMENTS
// =====================================

function displayPosts() {
    const container = document.getElementById("postsContainer");

    container.innerHTML = "";

    displayedPosts.forEach(function(post) {
        const div = document.createElement("div");
        div.className = "post-card";

        const number = document.createElement("small");
        number.textContent = "Post #" + post.displayNumber;

        const title = document.createElement("h3");
        title.textContent = post.title;

        const body = document.createElement("p");
        body.textContent = post.body;

        div.appendChild(number);
        div.appendChild(title);
        div.appendChild(body);

        // BONUS: Display comments
        const commentsTitle = document.createElement("h4");
        commentsTitle.textContent = "Comments";

        div.appendChild(commentsTitle);

        const comments = post.comments || [];

        if (comments.length === 0) {
            const noComments = document.createElement("p");
            noComments.textContent = "No comments available.";
            div.appendChild(noComments);
        } else {
            const commentsList = document.createElement("ul");
            commentsList.className = "comments-list";

            comments.forEach(function(comment) {
                const item = document.createElement("li");

                const name = document.createElement("strong");
                name.textContent = comment.name;

                const email = document.createElement("small");
                email.textContent = " (" + comment.email + ")";

                const commentBody = document.createElement("p");
                commentBody.textContent = comment.body;

                item.appendChild(name);
                item.appendChild(email);
                item.appendChild(commentBody);

                commentsList.appendChild(item);
            });

            div.appendChild(commentsList);
        }

        container.appendChild(div);
    });
}


// =====================================
// 1. GET REQUEST
// =====================================

async function getPosts() {
    const message = document.getElementById("getMessage");

    message.textContent = "Loading posts and comments...";

    try {
        // Retrieve all posts from API
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to retrieve posts");
        }

        const posts = await response.json();

        // Keep the first five API posts
        // and display your English example text
        displayedPosts = posts.slice(0, 5).map(function(post, index) {
            return {
                id: post.id,
                displayNumber: index + 1,
                title: englishPosts[index].title,
                body: englishPosts[index].body,
                comments: []
            };
        });

        // BONUS: Retrieve comments for each post
        const commentResponses = await Promise.all(
            displayedPosts.map(function(post) {
                return fetch(url + "/" + post.id + "/comments");
            })
        );

        // Check all comment responses
        for (const commentResponse of commentResponses) {
            if (!commentResponse.ok) {
                throw new Error("Failed to retrieve comments");
            }
        }

        // Convert responses into JSON
        const comments = await Promise.all(
            commentResponses.map(function(response) {
                return response.json();
            })
        );

        // Attach comments to their related posts
        displayedPosts.forEach(function(post, index) {
            post.comments = comments[index];
        });

        // Display posts and comments
        displayPosts();

        message.textContent =
            "Success! Loaded " + displayedPosts.length +
            " posts and their comments.";

    } catch (error) {
        message.textContent = "Error: " + error.message;
    }
}


// =====================================
// 2. POST REQUEST - CREATE A POST
// =====================================

document.getElementById("postForm").addEventListener(
    "submit",
    async function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const body = document.getElementById("body").value.trim();

        const message = document.getElementById("postMessage");

        if (!title || !body) {
            message.textContent =
                "Please enter a title and post content.";
            return;
        }

        message.textContent = "Creating post...";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                    userId: 1
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            const result = await response.json();

            // Add the new post to the displayed list
            displayedPosts.push({
                id: result.id,
                displayNumber: nextPostNumber,
                title: title,
                body: body,
                comments: []
            });

            const createdNumber = nextPostNumber;
            nextPostNumber++;

            displayPosts();

            message.textContent =
                "Success! Post #" + createdNumber +
                " was created.";

            document.getElementById("postForm").reset();

        } catch (error) {
            message.textContent = "Error: " + error.message;
        }
    }
);


// =====================================
// 3. PATCH REQUEST - UPDATE POST #1
// =====================================

document.getElementById("updateButton").addEventListener(
    "click",
    async function() {
        const message = document.getElementById("updateMessage");

        message.textContent = "Updating post #1...";

        try {
            const response = await fetch(url + "/1", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: "My Updated JavaScript Post"
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update post");
            }

            // Update the displayed post
            const post = displayedPosts.find(function(item) {
                return item.id === 1;
            });

            if (post) {
                post.title = "My Updated JavaScript Post";
            }

            displayPosts();

            message.textContent =
                "Success! Post #1 was updated.";

        } catch (error) {
            message.textContent = "Error: " + error.message;
        }
    }
);


// =====================================
// 4. DELETE REQUEST - DELETE POST #1
// =====================================

document.getElementById("deleteButton").addEventListener(
    "click",
    async function() {
        const message = document.getElementById("deleteMessage");

        message.textContent = "Deleting post #1...";

        try {
            const response = await fetch(url + "/1", {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            // Remove Post #1 from the displayed list
            displayedPosts = displayedPosts.filter(function(post) {
                return post.id !== 1;
            });

            displayPosts();

            message.textContent =
                "Success! Post #1 was deleted.";

        } catch (error) {
            message.textContent = "Error: " + error.message;
        }
    }
);


// =====================================
// LOAD POSTS AUTOMATICALLY
// =====================================

getPosts();
