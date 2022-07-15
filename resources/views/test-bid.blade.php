<form action="/bid" method="post">
    <b>Product  </b> <input type="text" name="name" placeholder="product name"><br><br>
    <b>Price  </b><input type="text" name="price" placeholder="price"><br><br>
    <b>Auction  </b><input type="text" name="auction" placeholder="auction"><br><br>
    <b>Session  </b><input type="text" name="session" placeholder="session"><br><br>
    <button type="submit">Bid</button>
    {{ csrf_field() }}
</form>
