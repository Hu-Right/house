<?php
namespace App\Http\Controllers\Home;
use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
 
class CityController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Email Verification Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling email verification for any
    | user that recently registered with the application. Emails may also
    | be re-sent if the user didn't receive the original email message.
    |
    */

    //use VerifiesEmails;

    /**
     * Where to redirect users after verification.
     *
     * @var string
     */
    //protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */

    /*
     * 热门城市 北京 上海 广州 深圳 成都
     */
    public function gethotcity()
    {   
         $result = [
                 'title'=>'热门城市',
                 'one'   =>'北京',
                  'two'  =>'上海',
                  'three'=>'广州',
                  'four' =>'深圳',
                  'five' =>'成都',
         ];
         return $this->success($result);     
    }


    /**
     *城市选择
     */
    public function getcity()
    {
        $list = DB::table('area')->where('pid',0)->select();

        dd($list);
        die;

    }


    /***
     * 按照省份字母排序
     */
    public function getsortcity()
    {

    }


}
