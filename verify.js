const baseUrl = 'http://localhost:3000';

async function test() {
    try {
        console.log('--- Starting Verification ---');

        // 1. GET /users
        console.log('\n1. GET /users');
        let res = await fetch(`${baseUrl}/users`);
        let data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Data:', data);
        if (res.status !== 200 || !Array.isArray(data)) throw new Error('GET /users failed');

        // 2. POST /user
        console.log('\n2. POST /user');
        const newUser = { firstName: "Test", lastName: "User", hobby: "Coding" };
        res = await fetch(`${baseUrl}/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Data:', data);
        if (res.status !== 201 || data.firstName !== "Test") throw new Error('POST /user failed');
        const newUserId = data.id;

        // 3. GET /users/:id
        console.log(`\n3. GET /users/${newUserId}`);
        res = await fetch(`${baseUrl}/users/${newUserId}`);
        data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Data:', data);
        if (res.status !== 200 || data.id !== newUserId) throw new Error('GET /users/:id failed');

        // 4. PUT /user/:id
        console.log(`\n4. PUT /user/${newUserId}`);
        const updatedUser = { firstName: "Updated", lastName: "User", hobby: "Testing" };
        res = await fetch(`${baseUrl}/user/${newUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });
        data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Data:', data);
        if (res.status !== 200 || data.firstName !== "Updated") throw new Error('PUT /user/:id failed');

        // 5. DELETE /user/:id
        console.log(`\n5. DELETE /user/${newUserId}`);
        res = await fetch(`${baseUrl}/user/${newUserId}`, { method: 'DELETE' });
        console.log(`Status: ${res.status}`);
        if (res.status !== 204) throw new Error('DELETE /user/:id failed');

        // 6. GET /users/:id (Verify deletion)
        console.log(`\n6. GET /users/${newUserId} (Verify deletion)`);
        res = await fetch(`${baseUrl}/users/${newUserId}`);
        if (res.status !== 404) throw new Error('Delete verification failed');
        console.log('Status: 404 (Expected)');

        console.log('\n--- Verification Passed ---');
    } catch (err) {
        console.error('\n--- Verification Failed ---');
        console.error(err);
        process.exit(1);
    }
}

test();
