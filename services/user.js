const User = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const S_user={
    //add a new user
    addUser: async (name, email, password)=> {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            name,
            email,
            password: hashedPassword, 
        });
        return await user.save()
    },

    // get a user by its name
    getUserByNameSearch: async (name) => {
        return await User.find({ name: {$regex: '^.*' + name + '.*$', $options: 'i'} });
    },

    // get a user by its email and password
    findUserByEmailAndPassword: async (email, password) => { 
        const user = await User.findOne({ email });
        if (user) {
            console.log("email found");
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (passwordMatches) {
                console.log("match found");
                return user; // Successfully authenticated
            } else {
                console.log("pass doesnt match");
                return null; // Invalid password
            }
        } else {
            console.log("email not found");
            return null; // User not found
        }
    },
    
    // get a user by its email 
    findUserByEmail:async(email)=>{
        return await User.findOne({ email });
    },
    
    // check if an email is listed for a user 
    checkIfEmailExists: async (email) => {
        const user = await User.findOne({ email });
        return user !== null;
    },

    // update user info
    updateUser: async (userId, updatedUserData) => {
            try {
                // Find the user by its ID and update its fields
                const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
                return updatedUser;
            } catch (e) {
                console.error(e);
                throw e;
            }
        }, 

    // delete user
    deleteUser: async (_id)=> {
        return await User.findOneAndDelete({ _id });
    },

    // get all users
    getAll: async ()=> {
        return await User.find({})
    },

    // get a user by its id 
    getUserById: async (UserId) => {
        try {
          // Query the database to retrieve the user by its ID
          const user = await User.findById(UserId);
    
          return user; // Return the retrieved users or null if not found
        } catch (error) {
          console.error('Error fetching user by ID:', error);
          throw error;
        }
      }, 
}

module.exports = S_user;
