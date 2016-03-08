<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\AdminController;
use App\Vehicle;
use Illuminate\Http\Request;
use Datatables;
use DB;


function getStringBetween($str,$from,$to)
{
    $sub = substr($str, strpos($str,$from)+strlen($from),strlen($str));
    return substr($sub,0,strpos($sub,$to));
}

class VehicleController extends AdminController
{


    public function __construct()
    {
        view()->share('type', 'vehicle');
    }

    /*
    * Display a listing of the resource.
    *
    * @return Response
    */
    public function index()
    {
        // Show the page
        return view('admin.vehicle.index');
    }

    
    
    /*
    * adds a location from an iridum auto tracking mail
    *
    * @return Response
    */
    public static function addLocationFromIridiumMail($header, $messageBody)
    {
        $from = $header->sender[0]->mailbox.'@'.$header->sender[0]->host;
        $unixtime = (int)$header->udate;
        
        //echo 'u'.$unixtime.'u';
        //print_r($unixtime);
        
        $lat = getStringBetween($messageBody,'Lat+',' Lon');
        //Lon+13.493400 Alt
        $lon = getStringBetween($messageBody,'Lon+',' Alt');
//        echo 'fuck';
//        echo $from;
//        echo $unixtime;
//        echo $header->fromaddress;
//        echo "\n";
//        
        //echo strpos($header->fromaddress, '@msg.iridium.com');
        
        if(strpos($header->fromaddress, '@msg.iridium.com') !== FALSE ){
            $sat_number = str_replace('@msg.iridium.com', '', $header->fromaddress);
            
            $vehicle = Vehicle::where('sat_number', '=',$sat_number)->get();
            echo $vehicle[0]->id;
            $vehicleLocation = new \App\VehicleLocation(array('lat'=>$lat, 'lon'=>$lon, 'vehicle_id'=>$vehicle[0]->id, 'timestamp'=>$unixtime,'connection_type'=>'iridium'));
            $vehicleLocation->save();
            echo $vehicleLocation->id;
        }
        
        
        //echo 'coord:'.$lat.','.$lon;
        
        
                           
        
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.vehicle.create_edit');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {

//        $user = new User ($request->except('password','password_confirmation'));
//        $user->password = bcrypt($request->password);
//        $user->confirmation_code = str_random(32);
//        $user->save();
        
        
        $vehicle = new Vehicle($request->all());
        $vehicle->save();
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param $user
     * @return Response
     */
    public function edit(Vehicle $vehicle)
    {
        return view('admin.vehicle.create_edit', compact('vehicle'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param $user
     * @return Response
     */
    public function update(Request $request, Vehicle $vehicle)
    {
      
        $vehicle->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $user
     * @return Response
     */

    public function delete($request, $vehicle)
    {
        echo $request;
        echo $vehicle;
        echo 'asd';
        
        return view('admin.vehicle.delete', compact('vehicle'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $user
     * @return Response
     */
    public function destroy(Vehicle $vehicle)
    {
        
        echo 'asdasd';
        $vehicle->delete();
    }

    /**
     * Show a list of all the languages posts formatted for Datatables.
     *
     * @return Datatables JSON
     */
    public function data()
    {
        
        
        //weird workaround because datable was broken
        $users = Vehicle::all();
        
        return Datatables::of($users)
            //->edit_column('confirmed', '@if ($confirmed=="1") <span class="glyphicon glyphicon-ok"></span> @else <span class=\'glyphicon glyphicon-remove\'></span> @endif')

           // ->remove_column('id')
            ->remove_column('created_at')
            ->remove_column('updated_at')
            ->remove_column('deleted_at')
            ->add_column('actions', '@if ($id!="1337")<a href="{{{ URL::to(\'admin/vehicle/\' . $id . \'/edit\' ) }}}" class="btn btn-success btn-sm iframe" ><span class="glyphicon glyphicon-pencil"></span>  {{ trans("admin/modal.edit") }}</a>
                    <a href="{{{ URL::to(\'admin/vehicle/\' . $id . \'/delete\' ) }}}" class="btn btn-sm btn-danger iframe"><span class="glyphicon glyphicon-trash"></span> {{ trans("admin/modal.delete") }}</a>
                @endif')
            ->make();
    }

}
