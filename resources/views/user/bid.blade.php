<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <title>Document</title>
</head>

<body>
    <div class="form">
        <h1>Auction products</h1>

    </div>

    <div class="body">
        <div>auction name: {{ $info->name }}</div>
        <div>start time: {{ $info->start_time }}</div>
        <div>close time: {{ $info->close_time }}</div>
    </div>
    <div style="margin-top: 10px">
        <div>product name: {{ $info->product_name }}</div>
        <div>product description: {{ $info->description }}</div>
        <div>start price: {{ $info->start_price }}</div>
        <div>step price: {{ $info->step_price }}</div>
        {{-- @if ($info->winner_id == '')
            <div>No one bid yet</div>
        @elseif ($info->winner_id != '')
            <div>winnwer: {{ $info->winner_id }}</div>
            <div>current highet bid: {{ $info->highest_price }}</div>
        @endif --}}
    </div>

    <form action="{{ url('/place_bid/' . $info->id) }}" method="post">
        @csrf
        <input type="hidden" name="start_price" value="{{ $info->start_price }}" />
        <label for="">Bid</label>
        <input type="number" name="bid" />
        @error('bid')
            <div class="alert alert-danger">{{ $message }}</div>
        @enderror
        <button type="submit">Place bid</button>
    </form>
</body>

</html>
