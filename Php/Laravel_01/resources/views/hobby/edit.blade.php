@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">Edit Hobby</div>
                <div class="card-body">
                    <form method='post' action="/hobby/{{$hobby->id}}">
                        @csrf
                        @method('PUT')
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" class="form-control {{ $errors->has('name') ? 'border-danger' : '' }}" id="name" name="name" value="{{$hobby->name ?? old('name')}}">
                            <small class="form-text text-danger">{!! $errors->first('name') !!}</small>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea class="form-control {{ $errors->has('name') ? 'border-danger' : '' }}" id="description" name="description" rows="5" value="{{$hobby->description ?? old('description')}}">{{$hobby->description ?? old('description')}}</textarea>
                            <small class="form-text text-danger">{!! $errors->first('description') !!}</small>
                        </div>
                        <input class="btn btn-primary mt-4" type="submit" value="Update Hobby">
                    </form>
                    <a class="btn btn-primary float-right" href="/hobby"><i class="fas fa-arrow-circle-up"></i> Back</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection