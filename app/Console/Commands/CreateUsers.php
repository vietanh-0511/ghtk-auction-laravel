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
    protected $description = 'Create a user have an email, password, and role...';

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

      if(User::query()->where('email', '=', $user['email'])->exists())
      {
        $this->error('ERROR: The email: `'.$user['email'].'` has existed');
        return;
      }

      if(!$this->isValidRole($user['role']))
      {
        $this->error('ERROR: The role `'.$user['role'].'` is invalid!');
        return;
      }

      $this->insertUser($user);
    }

    private function isValidRole(string $role): bool
    {
      foreach (Role::all() as $r)
      {
        if ($role === $r->name)
          return true;
      }
      return false;
    }

    private function insertUser(array $user): void
    {
      try {
        DB::beginTransaction();
        $id = DB::table('users')->insertGetId([
          'full_name' => $user['full_name'],
          'email' => $user['email'],
          'password' => bcrypt($user['password']),
          'address' => $user['address'],
          'phone' => $user['phone'],
          'created_at' => Carbon::now(),
          'updated_at' => Carbon::now()
        ]);

        $role_id =  DB::table('roles')->select('id')->where('name', $user['role'])->first()->id;
        DB::table('model_has_roles')->insert([
          'role_id' => $role_id,
          'model_type' => User::class,
          'model_id' => $id,
        ]);
        DB::commit();
        $this->info('Successful! Created `'.$user['role'].'`: `'.$user['email'].'`');
      } catch (\Exception $e) {
        DB::rollBack();
        $this->error('Something wrong!');
        return;
      }
    }
  }
