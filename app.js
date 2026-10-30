const url = "https://jsonplaceholder.typicode.com/posts";

// 1. GET REQUEST - Display all posts when the page loads
async function getPosts() {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to get posts");
        }

        const posts = await response.json();
        const container = document.getElementById("postsContainer");

        container.innerHTML = "";

        posts.forEach(function(post) {
            const div = document.createElement("div");
            const title = document.createElement("h3");
            const body = document.createElement("p");

            title.textContent = post.title;
            body.textContent = post.body;

            div.appendChild(title);
            div.appendChild(body);
            container.appendChild(div);
        });

        document.getElementById("getMessage").textContent =
            "Success! All posts loaded.";

    } catch (error) {
        document.getElementById("getMessage").textContent =
            "Error: " + error.message;
    }
}


// 2. POST REQUEST - Create a new post
document.getElementById("postForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

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

        document.getElementById("postMessage").textContent =
            "Success! Post created with ID: " + result.id;

        document.getElementById("postForm").reset();

    } catch (error) {
        document.getElementById("postMessage").textContent =
            "Error: " + error.message;
    }
});


// 3. PATCH REQUEST - Update post #1
document.getElementById("updateButton").addEventListener("click", async function() {
    try {
        const response = await fetch(url + "/1", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Updated Post Title"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update post");
        }

        document.getElementById("updateMessage").textContent =
            "Success! Post #1 updated.";

    } catch (error) {
        document.getElementById("updateMessage").textContent =
            "Error: " + error.message;
    }
});


// 4. DELETE REQUEST - Delete post #1
document.getElementById("deleteButton").addEventListener("click", async function() {
    try {
        const response = await fetch(url + "/1", {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete post");
        }

        document.getElementById("deleteMessage").textContent =
            "Success! Post #1 deleted.";

    } catch (error) {
        document.getElementById("deleteMessage").textContent =
            "Error: " + error.message;
    }
});


// Automatically load posts when the page opens
getPosts();