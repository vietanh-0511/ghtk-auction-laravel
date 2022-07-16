<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <div class="body">
        @foreach ($auctions as $auction)
            <table>
                <thead>
                    <tr>
                        <td>auction name</td>
                        <td>start time</td>
                        <td>close time</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ $auction->name }}</td>
                        <td>{{ $auction->start_time }}</td>
                        <td>{{ $auction->close_time }}</td>
                        <td>
                            <a href="{{ url('/auction_products/' . $auction->id) }}">enter auction</a><br>
                        </td>
                    </tr>
                </tbody>
            </table>
        @endforeach
    </div>
</body>

</html>
