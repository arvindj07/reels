import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider';
import { storage,database } from '../firebase'; // import storage, and database

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext); // consume Context value
    const [file, setFile] = useState(null)   // for input-img file

    // console.log(signup);
    const handleSignup = async (e) => {
        e.preventDefault(); // to prevent pg re-load on form-submit
        try {
            setLoading(true);
            let res = await signup(email, password);    // set User email nd pwd in Firebase auth
            let uid = res.user.uid;
            // Uploading Profile-pic in file-State to Storage
            // Listener used to upload file to Firebase-storage
            const uploadTaskListener = storage.ref(`/users/${uid}/profileImage`).put(file);
            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            // fn 1 -> progress tracking
            // fn2 -> error
            // fn3 -> success
            uploadTaskListener.on('state_changed', fn1, fn2, fn3);
            function fn1(snapshot) { // Display progress
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }
            function fn2(error) {   // error
                setError(error);
                setTimeout(() => {
                    setError('')
                }, 2000);
                setLoading(false)
            }
            async function fn3() {  // completion of File-upload to Storage
                let downloadUrl = await uploadTaskListener.snapshot.ref.getDownloadURL(); // file loaded to Stoage and returns URL
                console.log(downloadUrl);
                // Put new Document in 'user' collection of firestore
                await database.users.doc(uid).set({
                    email: email,
                    userId: uid,
                    username: name,
                    createdAt: database.getCurrentTimeStamp(),
                    profileUrl: downloadUrl,
                    postIds: []
                })
            }

            setLoading(false);
            console.log('User has Signed up');
        }
        catch (err) {
            setError(err)
            setTimeout(() => setError(''), 2000);
            setLoading(false)
        }
    }

    // Handle input-img file
    const handleFileSubmit = (e) => {
        let file = e.target.files[0];
        console.log(file);
        if (file != null) {
            setFile(file)   // set File-State
        }
    }
    return (
        <div>
            <form onSubmit={handleSignup} >
                <div>
                    <label htmlFor=''>UserName</label>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} />

                </div>
                <div>
                    <label htmlFor=''>Email</label>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor=''>Password</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    {/* Profile-Image  */}
                    <label htmlFor='profile'>Profile image</label>
                    <input type='file' accept='image/*' onChange={handleFileSubmit}></input>
                </div>
                <button type='submit' disabled={loading}>Login</button>
            </form>
        </div>
    )
}

export default Signup
