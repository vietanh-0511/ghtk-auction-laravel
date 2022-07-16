<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=d, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <h1>Request Auction</h1>
    <form method="post" action="{{ url('/request_auction') }}" enctype="multipart/form-data">
        @csrf
        <div>
            <label for="">product name</label>
            <input type="text" name="name" />
        </div>
        <div>
            <label for="">description</label>
            <input type="text" name="description" />
        </div>
        <div>
            <label for="">assets</label>
            <input type="file" name="assets[]" multiple/>
        </div>
        <button type="submit">Request</button>
    </form>
</body>

</html>
