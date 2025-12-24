
const SUPABASE_URL = "https://hqbrharumannyscjmtnc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnJoYXJ1bWFubnlzY2ptdG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzUyMTEsImV4cCI6MjA3NzIxMTIxMX0.NdBtSsHTREJVNI3Yt3jUQDg95VWSzSJ-OFrjy1fsVZ4";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/analyze-code`;

console.log("Testing Function URL:", FUNCTION_URL);

// Tiny 1x1 white pixel base64 jpeg
const blankImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwf4AAB//2Q==";

async function testFunction() {
    try {
        const response = await fetch(FUNCTION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                image: blankImage,
                language: null
            })
        });

        if (!response.ok) {
            console.error(`FUNCTION FAILED: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Error Body:", text);
        } else {
            const data = await response.json();
            console.log("FUNCTION SUCCESS:");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("NETWORK ERROR:", e.message);
    }
}

testFunction();
