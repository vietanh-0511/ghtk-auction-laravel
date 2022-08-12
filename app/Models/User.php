<?php

  namespace App\Models;

  use DateTimeInterface;
  use Illuminate\Contracts\Auth\MustVerifyEmail;
  use Illuminate\Database\Eloquent\Factories\HasFactory;
  use Illuminate\Database\Eloquent\SoftDeletes;
  use Illuminate\Foundation\Auth\User as Authenticatable;
  use Illuminate\Notifications\Notifiable;
  use Laravel\Sanctum\HasApiTokens;
  use Spatie\Permission\Traits\HasRoles;
  use Tymon\JWTAuth\Contracts\JWTSubject;

  class User extends Authenticatable implements JWTSubject
  {
    use HasRoles, HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
      'full_name',
      'email',
      'password',
      'address',
      'phone'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
      'password',
      'email_verified_at',
      'remember_token',
      'created_at',
      'updated_at',
      'deleted_at',
      'roles',
      'permissions',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
      'email_verified_at' => 'datetime',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
      return $date->format('Y-m-d H:i:s');
    }

    public function bids()
    {
      return $this->hasMany(Bid::class);
    }

    public function verifyEmail()
    {
      return $this->hasOne(VerifyEmail::class);
    }

    public function setPasswordAttribute($value)
    {
      $this->attributes['password'] = bcrypt($value);
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
      return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
      return [];
    }
  }
