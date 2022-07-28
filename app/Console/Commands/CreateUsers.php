<?php

  namespace App\Console\Commands;

  use App\Models\User;
  use Carbon\Carbon;
  use Exception;
  use Illuminate\Console\Command;
  use Illuminate\Support\Facades\DB;
  use Spatie\Permission\Models\Role;

  class CreateUsers extends Command
  {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:create {email} {password} {role} {--F|full_name=Default Name} {--A|address=Default Address} {--P|phone=0000000000}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an user have an email, password, and role...';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
      parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     * @throws Exception
     */
    public function handle()
    {
      $user['email'] = $this->argument('email');
      $user['password'] = $this->argument('password');
      $user['role'] = $this->argument('role');
      $user['full_name'] = $this->option('full_name');
      $user['address'] = $this->option('address');
      $user['phone'] = $this->option('phone');

      if(User::where('email', '=', $user['email'])->exists())
      {
        $this->error('ERROR: The email: `'.$user['email'].'` has existed');
        return;
      }

      if(!Role::where('name', $user['role'])->exists())
      {
        $this->error('ERROR: The role `'.$user['role'].'` is invalid!');
        return;
      }

      $this->insertUser($user);
    }

    private function insertUser(array $user): void
    {
      try {
        DB::beginTransaction();
        $u = User::create([
          'full_name' => $user['full_name'],
          'email' => $user['email'],
          'password' => $user['password'],
          'address' => $user['address'],
          'phone' => $user['phone'],
        ]);
        $u->assignRole($user['role']);
        DB::commit();
        $this->info('Successful! Created `'.$user['role'].'`: `'.$user['email'].'`');
      } catch (\Exception $e) {
        DB::rollBack();
        $this->error($e->getMessage());
        return;
      }
    }
  }
