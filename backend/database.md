# A point of sale web app.


# Required tables
  *  User
    - username
    - password
    - role
  
  * Product
    - userId
    - name
    - quantity
    - isAvailable
    
  * Sale
    - userId
    - product [foreinkey]
    - price
    - quantity

  * Exchange
   - price