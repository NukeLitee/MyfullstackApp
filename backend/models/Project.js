const json = [
    {
        "_id": objectID,
        "email": userEmail,
        "password": "$2b$10$abcdefghijklmnopqrstuvwxyzABCDEF.hashedPassword",
        "username": userName,
        "createdAt": { "$date": "2024-07-09T10:00:00.000Z" },
        "updatedAt": { "$date": "2024-07-09T10:00:00.000Z" },
        "preferences": {
            "theme": "dark",
            "notifications": {
                "email": true,
                "inApp": true
            }
        }
    },
    {
        "_id": { "$oid": "668d2b2c9d6f3c001c9e7a8c" },
        "email": "tranvanb@example.com",
        "password": "$2b$10$anotherhashedpasswordXYZ0123456789.anotherhashed",
        "username": "Trần Văn B",
        "createdAt": { "$date": "2024-07-09T11:30:00.000Z" },
        "updatedAt": { "$date": "2024-07-09T11:30:00.000Z" },
        "preferences": {}
    }
]