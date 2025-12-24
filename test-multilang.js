

const SUPABASE_URL = "https://hqbrharumannyscjmtnc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnJoYXJ1bWFubnlzY2ptdG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzUyMTEsImV4cCI6MjA3NzIxMTIxMX0.NdBtSsHTREJVNI3Yt3jUQDg95VWSzSJ-OFrjy1fsVZ4";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/analyze-code`;

// Tiny 1x1 base64 image (valid but blank)
const dummyImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwf4AAB//2Q==";

const languages = ['python', 'javascript', 'java', 'cpp', 'html', 'css', 'auto'];

console.log("Starting Multilingual Test Suite...");

async function runTests() {
    for (const lang of languages) {
        process.stdout.write(`Testing language support: [${lang.toUpperCase()}] ... `);
        try {
            const response = await fetch(FUNCTION_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    image: dummyImage,
                    language: lang === 'auto' ? null : lang
                })
            });

            if (response.ok) {
                // We expect 200 OK. The content might be "No code detected" which is fine for this test.
                console.log("✅ OK");
            } else {
                console.log(`❌ FAILED (${response.status})`);
                const text = await response.text();
                console.log(`   Error: ${text.substring(0, 100)}...`);
            }
        } catch (error) {
            console.log("❌ NETWORK ERROR");
            console.log(`   ${error.message}`);
        }
        // Small delay to be nice to the API
        await new Promise(r => setTimeout(r, 500));
    }
}

runTests();
